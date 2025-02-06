import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Fund } from './fund.entity.js';
import { LimitedPartner } from './limited-partner.entity.js';
import { GeneralPartner } from './general-partner.entity.js';
import { Transaction } from './transaction.entity.js';

@Entity('limited_partnerships')
export class LimitedPartnership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'fund_id' })
  fundId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 100, name: 'account_number', unique: true })
  accountNumber: string;

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 4,
    name: 'cash_balance',
    default: 0,
  })
  cashBalance: number;

  @ManyToOne(() => Fund, fund => fund.limitedPartnerships)
  @JoinColumn({ name: 'fund_id' })
  fund: Fund;

  @OneToMany(() => LimitedPartner, partner => partner.limitedPartnership)
  limitedPartners: LimitedPartner[];

  @OneToMany(() => GeneralPartner, partner => partner.limitedPartnership)
  generalPartners: GeneralPartner[];

  @OneToMany(() => Transaction, transaction => transaction.limitedPartnership)
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