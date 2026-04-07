import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Equipment } from './equipment.entity';

@Entity('maintenance')
export class Maintenance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 'scheduled' })
  status: string;

  @Column({ type: 'timestamp' })
  scheduled_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  completed_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cost: number;

  @Column({ type: 'text', nullable: true })
  technician_notes: string;

  @Column()
  equipment_id: number;

  @Column({ nullable: true })
  assigned_to: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Equipment)
  equipment: Equipment;

  @ManyToOne(() => User)
  assigned_to_user: User;
}