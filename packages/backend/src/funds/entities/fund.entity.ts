import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { LimitedPartnership } from './limited-partnership.entity.js';

export enum FundStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  LIQUIDATED = 'liquidated',
}

@Entity('funds')
export class Fund {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer' })
  vintage: number;

  @Column({
    type: 'varchar',
    length: 50,
    enum: FundStatus,
  })
  status: FundStatus;

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 4,
    name: 'total_commitments',
  })
  totalCommitments: number;

  @OneToMany(() => LimitedPartnership, lp => lp.fund)
  limitedPartnerships: LimitedPartnership[];

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