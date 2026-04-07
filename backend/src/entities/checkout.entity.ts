import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Equipment } from './equipment.entity';

@Entity('checkouts')
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  checkout_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  expected_return_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  actual_return_date: Date;

  @Column({ type: 'text', nullable: true })
  purpose: string;

  @Column({ default: 'pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column()
  user_id: number;

  @Column()
  equipment_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Equipment)
  equipment: Equipment;
}