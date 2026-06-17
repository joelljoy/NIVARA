import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('vitals')
export class Vital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column('float', { nullable: true })
  bloodPressureSystolic: number;

  @Column('float', { nullable: true })
  bloodPressureDiastolic: number;

  @Column('float', { nullable: true })
  heartRate: number;

  @Column('float', { nullable: true })
  bloodSugarFasting: number;

  @Column('float', { nullable: true })
  bloodSugarPostMeal: number;

  @Column('float', { nullable: true })
  oxygenSaturation: number;

  @Column('float', { nullable: true })
  temperature: number;

  @Column('float', { nullable: true })
  weightKg: number;

  @Column('float', { nullable: true })
  heightCm: number;

  @Column('float', { nullable: true })
  bmi: number;

  @Column({ type: 'timestamp' })
  recordedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
