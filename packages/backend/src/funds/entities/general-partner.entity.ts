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

export enum GeneralPartnerRole {
  MANAGING_PARTNER = 'managing_partner',
  PARTNER = 'partner',
  VENTURE_PARTNER = 'venture_partner',
}

@Entity('general_partners')
export class GeneralPartner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'limited_partnership_id' })
  limitedPartnershipId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
    enum: GeneralPartnerRole,
  })
  role: GeneralPartnerRole;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'carry_percentage',
  })
  carryPercentage: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    name: 'management_fee_percentage',
  })
  managementFeePercentage: number;

  @Column({ type: 'jsonb', name: 'contact_info' })
  contactInfo: {
    email: string;
    phone?: string;
    address?: string;
  };

  @ManyToOne(() => LimitedPartnership, lp => lp.generalPartners)
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