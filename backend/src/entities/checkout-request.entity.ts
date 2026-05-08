import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Equipment } from './equipment.entity';

@Entity('checkout_requests')
export class CheckoutRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @Column({ name: 'equipment_id' })
  equipmentId: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ name: 'student_id' })
  studentId: number;

  @Column({ type: 'varchar', length: 255 })
  borrowerName: string;

  @Column({ type: 'varchar', length: 255 })
  borrowerEmail: string;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'text' })
  purpose: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string; // pending, approved, rejected, picked_up, returned

  @Column({ type: 'varchar', length: 255, nullable: true })
  adminNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  pickedUpAt: Date;

  @Column({ type: 'datetime', nullable: true })
  returnedAt: Date;
}