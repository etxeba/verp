# Fund Model Design Plan

## Overview
A fund is modeled as a logical group of sub-entities, starting with Limited Partnerships (LPs). Each LP represents an investment vehicle with its own portfolio of investments, cash management, and transaction history.

## Core Entities

### 1. Fund
- Represents the top-level fund entity
- Contains multiple Limited Partnerships
- Aggregates total fund metrics
```typescript
interface Fund {
  id: string;
  name: string;
  description?: string;
  vintage: number;  // Fund vintage year
  status: 'active' | 'closed' | 'liquidated';
  totalCommitments: number;  // Total committed capital
  limitedPartnerships: LimitedPartnership[];
  createdAt: Date;
  updatedAt: Date;
}
```

### 2. Limited Partnership (LP)
- Represents an investment vehicle within the fund
- Tracks investment positions, transactions, and cash balance
```typescript
interface LimitedPartnership {
  id: string;
  fundId: string;
  name: string;
  description?: string;
  accountNumber: string;  // Unique identifier for the brokerage account
  investmentPositions: InvestmentPosition[];
  transactions: Transaction[];
  cashBalance: number;
  totalValue: number;  // Aggregate value (cash + investments)
  createdAt: Date;
  updatedAt: Date;
}
```

### 3. Portfolio Company
- Represents a company that receives investment
- Tracks company information and valuation metrics
```typescript
interface PortfolioCompany {
  id: string;
  name: string;
  description?: string;
  sector: string;
  stage: string;
  status: 'active' | 'exited' | 'written_off';
  createdAt: Date;
  updatedAt: Date;
}
```

### 4. Investment Position
- Represents shares owned in a Portfolio Company
- Tracks current ownership and valuation
```typescript
interface InvestmentPosition {
  id: string;
  lpId: string;
  portfolioCompanyId: string;
  sharesOwned: number;
  costBasis: number;  // Total cost of acquisition
  currentValue: number;  // Current market value
  ownershipPercentage: number;  // Current ownership percentage
  createdAt: Date;
  updatedAt: Date;
}
```

### 5. Transaction
- Records investment activities (buys/sells)
- Captures share price and ownership information
```typescript
interface Transaction {
  id: string;
  lpId: string;
  portfolioCompanyId: string;
  type: 'buy' | 'sell';
  date: Date;
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  sharesOutstanding: number;  // Total shares outstanding at time of transaction
  fullyDilutedShares: number;  // Total fully diluted shares at time of transaction
  createdAt: Date;
  updatedAt: Date;
}
```

## Database Schema

### funds
```sql
CREATE TABLE funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  vintage INTEGER NOT NULL,
  status VARCHAR(50) NOT NULL,
  total_commitments DECIMAL(19,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### limited_partnerships
```sql
CREATE TABLE limited_partnerships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fund_id UUID NOT NULL REFERENCES funds(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  account_number VARCHAR(100) NOT NULL UNIQUE,
  cash_balance DECIMAL(19,4) NOT NULL DEFAULT 0,
  total_value DECIMAL(19,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### portfolio_companies
```sql
CREATE TABLE portfolio_companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sector VARCHAR(100) NOT NULL,
  stage VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### investment_positions
```sql
CREATE TABLE investment_positions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lp_id UUID NOT NULL REFERENCES limited_partnerships(id),
  portfolio_company_id UUID NOT NULL REFERENCES portfolio_companies(id),
  shares_owned DECIMAL(19,4) NOT NULL,
  cost_basis DECIMAL(19,4) NOT NULL,
  current_value DECIMAL(19,4) NOT NULL,
  ownership_percentage DECIMAL(7,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(lp_id, portfolio_company_id)
);
```

### transactions
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lp_id UUID NOT NULL REFERENCES limited_partnerships(id),
  portfolio_company_id UUID NOT NULL REFERENCES portfolio_companies(id),
  type VARCHAR(50) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  shares DECIMAL(19,4) NOT NULL,
  price_per_share DECIMAL(19,4) NOT NULL,
  total_amount DECIMAL(19,4) NOT NULL,
  shares_outstanding DECIMAL(19,4) NOT NULL,
  fully_diluted_shares DECIMAL(19,4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Implementation Plan

### Phase 1: Core Entities
1. Create database migrations for all tables
2. Implement TypeORM entities
3. Create DTOs for API requests/responses
4. Implement basic CRUD operations for each entity

### Phase 2: Business Logic
1. Implement transaction processing
   - Validate and process buy/sell transactions
   - Update investment positions
   - Update cash balances
2. Implement position calculations
   - Cost basis calculation
   - Current value updates
   - Ownership percentage calculations

### Phase 3: API Development
1. Create REST endpoints for all operations
2. Implement validation and error handling
3. Add authentication and authorization
4. Create API documentation

### Phase 4: Testing
1. Unit tests for all business logic
2. Integration tests for API endpoints
3. End-to-end testing scenarios
4. Performance testing for large datasets

## Next Steps
1. Review and finalize this design
2. Begin implementation of database schema
3. Create TypeORM entities
4. Implement core business logic