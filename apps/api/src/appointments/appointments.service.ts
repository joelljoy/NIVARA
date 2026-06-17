import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThan } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepo: Repository<Appointment>,
  ) {}

  async create(patientId: string, dto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentsRepo.create({
      ...dto,
      patientId,
      scheduledAt: new Date(dto.scheduledAt),
    });
    return this.appointmentsRepo.save(appointment);
  }

  async findUpcoming(userId: string, role: string): Promise<Appointment[]> {
    const whereClause: any = {
      status: AppointmentStatus.SCHEDULED,
      scheduledAt: MoreThanOrEqual(new Date()),
    };
    
    if (role === UserRole.PATIENT) {
      whereClause.patientId = userId;
    } else if (role === UserRole.DOCTOR) {
      whereClause.doctorId = userId;
    }

    return this.appointmentsRepo.find({
      where: whereClause,
      order: { scheduledAt: 'ASC' },
      relations: { doctor: true, patient: true }, // To return associated user details
    });
  }

  async findHistory(userId: string, role: string): Promise<Appointment[]> {
    const whereClause: any = {};
    if (role === UserRole.PATIENT) {
      whereClause.patientId = userId;
    } else if (role === UserRole.DOCTOR) {
      whereClause.doctorId = userId;
    }

    return this.appointmentsRepo.find({
      where: [
        { ...whereClause, status: AppointmentStatus.COMPLETED },
        { ...whereClause, status: AppointmentStatus.CANCELLED },
        { ...whereClause, scheduledAt: LessThan(new Date()) },
      ],
      order: { scheduledAt: 'DESC' },
      relations: { doctor: true, patient: true },
    });
  }

  async update(userId: string, role: string, id: string, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepo.findOne({ where: { id } });
    if (!appointment) throw new NotFoundException('Appointment not found');

    // Ensure only the patient or doctor involved can update
    if (role === UserRole.PATIENT && appointment.patientId !== userId) {
      throw new UnauthorizedException();
    }
    if (role === UserRole.DOCTOR && appointment.doctorId !== userId) {
      throw new UnauthorizedException();
    }

    Object.assign(appointment, dto);
    if (dto.scheduledAt) {
      appointment.scheduledAt = new Date(dto.scheduledAt);
      if (appointment.status === AppointmentStatus.SCHEDULED && dto.scheduledAt !== appointment.scheduledAt.toISOString()) {
        appointment.status = AppointmentStatus.RESCHEDULED; // Auto state transition
      }
    }

    return this.appointmentsRepo.save(appointment);
  }
}
