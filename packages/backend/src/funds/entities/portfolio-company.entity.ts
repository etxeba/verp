import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transaction } from './transaction.entity.js';

export enum PortfolioCompanyStage {
  SEED = 'seed',
  SERIES_A = 'series_a',
  SERIES_B = 'series_b',
  SERIES_C = 'series_c',
  SERIES_D = 'series_d',
  LATE = 'late',
  PRE_IPO = 'pre_ipo',
}

export enum PortfolioCompanyStatus {
  ACTIVE = 'active',
  EXITED = 'exited',
  WRITTEN_OFF = 'written_off',
}

@Entity('portfolio_companies')
export class PortfolioCompany {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100 })
  sector: string;

  @Column({
    type: 'varchar',
    length: 100,
    enum: PortfolioCompanyStage,
  })
  stage: PortfolioCompanyStage;

  @Column({
    type: 'varchar',
    length: 50,
    enum: PortfolioCompanyStatus,
  })
  status: PortfolioCompanyStatus;

  @OneToMany(() => Transaction, transaction => transaction.portfolioCompany)
  transactions: Transaction[];

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