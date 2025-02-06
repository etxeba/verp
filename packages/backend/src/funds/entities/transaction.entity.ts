import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LimitedPartnership } from './limited-partnership.entity.js';
import { PortfolioCompany } from './portfolio-company.entity.js';
import { LimitedPartner } from './limited-partner.entity.js';
import { GeneralPartner } from './general-partner.entity.js';

export enum TransactionType {
  // Investment transactions
  BUY = 'buy',
  SELL = 'sell',
  // Distribution transactions
  CAPITAL_RETURN = 'capital_return',
  REALIZED_GAIN = 'realized_gain',
  DIVIDEND = 'dividend',
}

export enum RecipientType {
  LIMITED_PARTNER = 'limited_partner',
  GENERAL_PARTNER = 'general_partner',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'lp_id' })
  limitedPartnershipId: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'timestamp with time zone' })
  date: Date;

  // For investment transactions
  @Column({ type: 'uuid', name: 'portfolio_company_id', nullable: true })
  portfolioCompanyId?: string;

  @Column({ type: 'decimal', precision: 19, scale: 4, nullable: true })
  shares?: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, name: 'price_per_share', nullable: true })
  pricePerShare?: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, name: 'shares_outstanding', nullable: true })
  sharesOutstanding?: number;

  @Column({ type: 'decimal', precision: 19, scale: 4, name: 'fully_diluted_shares', nullable: true })
  fullyDilutedShares?: number;

  // For distribution transactions
  @Column({ type: 'varchar', length: 50, name: 'recipient_type', nullable: true })
  recipientType?: RecipientType;

  @Column({ type: 'uuid', name: 'recipient_id', nullable: true })
  recipientId?: string;

  // Common fields
  @Column({ type: 'decimal', precision: 19, scale: 4, name: 'total_amount' })
  totalAmount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // Relationships
  @ManyToOne(() => LimitedPartnership, lp => lp.transactions)
  @JoinColumn({ name: 'lp_id' })
  limitedPartnership: LimitedPartnership;

  @ManyToOne(() => PortfolioCompany, company => company.transactions)
  @JoinColumn({ name: 'portfolio_company_id' })
  portfolioCompany?: PortfolioCompany;

  @ManyToOne(() => LimitedPartner)
  @JoinColumn({ name: 'recipient_id' })
  limitedPartnerRecipient?: LimitedPartner;

  @ManyToOne(() => GeneralPartner)
  @JoinColumn({ name: 'recipient_id' })
  generalPartnerRecipient?: GeneralPartner;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'updated_at',
  })
  updatedAt: Date;
}