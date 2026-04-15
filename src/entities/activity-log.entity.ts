import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  action: string;

  @Column({ length: 100 })
  entity_type: string;

  @Column()
  entity_id: number;

  @Column({ type: 'json', nullable: true })
  changes: object;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  ip_address: string;

  @Column()
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User)
  user: User;
}