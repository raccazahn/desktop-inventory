import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Equipment } from './equipment.entity';

@Entity('checkouts')
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @Column({ name: 'equipment_id' })
  equipmentId: number;

  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ type: 'varchar', length: 255 })
  borrowerName: string;

  @Column({ type: 'varchar', length: 255 })
  borrowerEmail: string;

  @Column({ type: 'datetime' })
  dueDate: Date;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ type: 'varchar', length: 50, default: 'borrowed' })
  status: string;
  
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  returnDate: Date;
}