import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Equipment } from './equipment.entity';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'info' })
  severity: string;

  @Column({ default: 'unread' })
  status: string;

  @Column({ nullable: true })
  triggered_by: string;

  @Column()
  equipment_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Equipment)
  equipment: Equipment;
}