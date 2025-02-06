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

export enum LimitedPartnerType {
  INDIVIDUAL = 'individual',
  INSTITUTION = 'institution',
  FUND_OF_FUNDS = 'fund_of_funds',
}

@Entity('limited_partners')
export class LimitedPartner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'limited_partnership_id' })
  limitedPartnershipId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: LimitedPartnerType,
  })
  type: LimitedPartnerType;

  @Column({
    type: 'decimal',
    precision: 19,
    scale: 4,
    name: 'commitment_amount',
  })
  commitmentAmount: number;

  @Column({ type: 'text', nullable: true, name: 'distribution_preference' })
  distributionPreference?: string;

  @Column({ type: 'jsonb', name: 'contact_info' })
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };

  @ManyToOne(() => LimitedPartnership, lp => lp.limitedPartners)
  @JoinColumn({ name: 'limited_partnership_id' })
  limitedPartnership: LimitedPartnership;

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