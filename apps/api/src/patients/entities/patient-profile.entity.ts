import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('patient_profiles')
export class PatientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  bloodGroup: string;

  @Column('simple-array', { nullable: true })
  allergies: string[];

  @Column('simple-array', { nullable: true })
  chronicConditions: string[];

  @Column('simple-array', { nullable: true })
  familyMedicalHistory: string[];

  @Column('jsonb', { nullable: true })
  emergencyContacts: { name: string; relation: string; phone: string }[];

  @Column({ nullable: true })
  heightCm: number;

  @Column({ nullable: true })
  weightKg: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
