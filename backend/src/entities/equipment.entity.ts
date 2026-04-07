import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Category } from './category.entity';

@Entity('equipment')
export class Equipment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 50 })
  asset_tag: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  serial_number: string;

  @Column({ default: 'available' })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchase_price: number;

  @Column({ type: 'date', nullable: true })
  purchase_date: Date;

  @Column({ nullable: true })
  location: string;

  @Column({ default: true })
  is_active: boolean;

  @Column()
  category_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Category)
  category: Category;
}