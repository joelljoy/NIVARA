import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medication.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private medicationsRepo: Repository<Medication>,
  ) {}

  async create(userId: string, dto: CreateMedicationDto): Promise<Medication> {
    const medication = this.medicationsRepo.create({
      ...dto,
      userId,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
    return this.medicationsRepo.save(medication);
  }

  async findAllActive(userId: string): Promise<Medication[]> {
    return this.medicationsRepo.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllHistory(userId: string): Promise<Medication[]> {
    return this.medicationsRepo.find({
      where: { userId },
      order: { endDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async update(userId: string, id: string, dto: UpdateMedicationDto): Promise<Medication> {
    const medication = await this.medicationsRepo.findOne({ where: { id, userId } });
    if (!medication) throw new NotFoundException('Medication not found');

    Object.assign(medication, dto);
    if (dto.startDate) medication.startDate = new Date(dto.startDate);
    if (dto.endDate) medication.endDate = new Date(dto.endDate);
    
    return this.medicationsRepo.save(medication);
  }

  async remove(userId: string, id: string): Promise<void> {
    const medication = await this.medicationsRepo.findOne({ where: { id, userId } });
    if (!medication) throw new NotFoundException('Medication not found');
    await this.medicationsRepo.remove(medication);
  }

  async requestRefill(userId: string, id: string): Promise<Medication> {
    const medication = await this.medicationsRepo.findOne({ where: { id, userId } });
    if (!medication) throw new NotFoundException('Medication not found');
    
    medication.needsRefill = true;
    return this.medicationsRepo.save(medication);
  }
}
