import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFundTables1707263496 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create funds table
    await queryRunner.query(`
      CREATE TABLE funds (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        vintage INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL,
        total_commitments DECIMAL(19,4) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create limited_partnerships table
    await queryRunner.query(`
      CREATE TABLE limited_partnerships (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        fund_id UUID NOT NULL REFERENCES funds(id),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        account_number VARCHAR(100) NOT NULL UNIQUE,
        cash_balance DECIMAL(19,4) NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create limited_partners table
    await queryRunner.query(`
      CREATE TABLE limited_partners (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        limited_partnership_id UUID NOT NULL REFERENCES limited_partnerships(id),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        commitment_amount DECIMAL(19,4) NOT NULL,
        distribution_preference TEXT,
        contact_info JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create general_partners table
    await queryRunner.query(`
      CREATE TABLE general_partners (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        limited_partnership_id UUID NOT NULL REFERENCES limited_partnerships(id),
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        carry_percentage DECIMAL(5,2) NOT NULL,
        management_fee_percentage DECIMAL(5,2) NOT NULL,
        contact_info JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create portfolio_companies table
    await queryRunner.query(`
      CREATE TABLE portfolio_companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sector VARCHAR(100) NOT NULL,
        stage VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table (includes both investments and distributions)
    await queryRunner.query(`
      CREATE TABLE transactions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        lp_id UUID NOT NULL REFERENCES limited_partnerships(id),
        type VARCHAR(50) NOT NULL,
        date TIMESTAMP WITH TIME ZONE NOT NULL,
        portfolio_company_id UUID REFERENCES portfolio_companies(id),
        shares DECIMAL(19,4),
        price_per_share DECIMAL(19,4),
        shares_outstanding DECIMAL(19,4),
        fully_diluted_shares DECIMAL(19,4),
        recipient_type VARCHAR(50),
        recipient_id UUID,
        total_amount DECIMAL(19,4) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_recipient CHECK (
          (type IN ('buy', 'sell') AND portfolio_company_id IS NOT NULL) OR
          (type IN ('capital_return', 'realized_gain', 'dividend') AND recipient_type IS NOT NULL AND recipient_id IS NOT NULL)
        )
      )
    `);

    // Create investment_positions_view
    await queryRunner.query(`
      CREATE VIEW investment_positions_view AS
      WITH position_calculations AS (
        SELECT
          lp_id,
          portfolio_company_id,
          SUM(CASE WHEN type = 'buy' THEN shares 
                   WHEN type = 'sell' THEN -shares 
              END) as shares_owned,
          SUM(CASE WHEN type = 'buy' THEN total_amount 
                   WHEN type = 'sell' THEN -total_amount 
              END) as cost_basis,
          MAX(date) as last_transaction_date,
          FIRST_VALUE(shares_outstanding) OVER (
            PARTITION BY lp_id, portfolio_company_id 
            ORDER BY date DESC
          ) as latest_shares_outstanding,
          FIRST_VALUE(fully_diluted_shares) OVER (
            PARTITION BY lp_id, portfolio_company_id 
            ORDER BY date DESC
          ) as latest_fully_diluted_shares
        FROM transactions
        WHERE type IN ('buy', 'sell')
        GROUP BY lp_id, portfolio_company_id
      )
      SELECT
        lp_id,
        portfolio_company_id,
        shares_owned,
        cost_basis,
        CASE WHEN shares_owned > 0 
             THEN cost_basis / shares_owned 
             ELSE 0 
        END as average_cost_per_share,
        CASE WHEN latest_shares_outstanding > 0 
             THEN (shares_owned / latest_shares_outstanding) * 100 
             ELSE 0 
        END as ownership_percentage,
        last_transaction_date
      FROM position_calculations
      WHERE shares_owned > 0
    `);

    // Create performance_metrics_view
    await queryRunner.query(`
      CREATE VIEW performance_metrics_view AS
      WITH 
      capital_calls AS (
        SELECT 
          lp_id,
          SUM(total_amount) as total_invested
        FROM transactions
        WHERE type = 'buy'
        GROUP BY lp_id
      ),
      distributions_summary AS (
        SELECT
          lp_id,
          SUM(total_amount) as total_distributions
        FROM transactions
        WHERE type IN ('capital_return', 'realized_gain', 'dividend')
        GROUP BY lp_id
      ),
      current_values AS (
        SELECT
          lp_id,
          SUM(shares_owned * latest_price) as total_value
        FROM investment_positions_view ip
        JOIN (
          SELECT 
            portfolio_company_id,
            price_per_share as latest_price
          FROM transactions t1
          WHERE date = (
            SELECT MAX(date)
            FROM transactions t2
            WHERE t2.portfolio_company_id = t1.portfolio_company_id
            AND t2.type IN ('buy', 'sell')
          )
        ) latest_prices ON ip.portfolio_company_id = latest_prices.portfolio_company_id
        GROUP BY lp_id
      )
      SELECT
        lp.id as lp_id,
        lp.name,
        cc.total_invested,
        ds.total_distributions,
        cv.total_value,
        -- Net TVPI (Total Value to Paid-In)
        (cv.total_value + COALESCE(ds.total_distributions, 0)) / 
          NULLIF(cc.total_invested, 0) as net_tvpi,
        -- DPI (Distributions to Paid-In)
        COALESCE(ds.total_distributions, 0) / 
          NULLIF(cc.total_invested, 0) as dpi,
        -- Gross MOIC (Multiple on Invested Capital)
        (cv.total_value + COALESCE(ds.total_distributions, 0)) / 
          NULLIF(cc.total_invested, 0) as gross_moic
      FROM limited_partnerships lp
      LEFT JOIN capital_calls cc ON lp.id = cc.lp_id
      LEFT JOIN distributions_summary ds ON lp.id = ds.lp_id
      LEFT JOIN current_values cv ON lp.id = cv.lp_id
    `);

    // Create updated_at triggers
    const tables = [
      'funds',
      'limited_partnerships',
      'limited_partners',
      'general_partners',
      'portfolio_companies',
      'transactions',
    ];

    // Create trigger function for updated_at
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql
    `);

    // Create triggers for each table
    for (const table of tables) {
      await queryRunner.query(`
        CREATE TRIGGER update_${table}_updated_at
        BEFORE UPDATE ON ${table}
        FOR EACH ROW
        EXECUTE FUNCTION trigger_set_timestamp()
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop views
    await queryRunner.query('DROP VIEW IF EXISTS performance_metrics_view');
    await queryRunner.query('DROP VIEW IF EXISTS investment_positions_view');

    // Drop trigger function
    await queryRunner.query('DROP FUNCTION IF EXISTS trigger_set_timestamp() CASCADE');

    // Drop tables
    await queryRunner.query('DROP TABLE IF EXISTS transactions');
    await queryRunner.query('DROP TABLE IF EXISTS portfolio_companies');
    await queryRunner.query('DROP TABLE IF EXISTS general_partners');
    await queryRunner.query('DROP TABLE IF EXISTS limited_partners');
    await queryRunner.query('DROP TABLE IF EXISTS limited_partnerships');
    await queryRunner.query('DROP TABLE IF EXISTS funds');

    // Drop UUID extension
    await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp"');
  }
}