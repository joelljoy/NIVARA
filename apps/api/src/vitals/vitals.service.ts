import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Vital } from './entities/vital.entity';
import { CreateVitalDto, UpdateVitalDto } from './dto/vital.dto';

@Injectable()
export class VitalsService {
  constructor(
    @InjectRepository(Vital)
    private vitalsRepo: Repository<Vital>,
  ) {}

  async create(userId: string, dto: CreateVitalDto): Promise<Vital> {
    const bmi = (dto.weightKg && dto.heightCm) 
      ? Number((dto.weightKg / Math.pow(dto.heightCm / 100, 2)).toFixed(2)) 
      : undefined;

    const vital = this.vitalsRepo.create({
      ...dto,
      bmi,
      userId,
      recordedAt: new Date(dto.recordedAt),
    });
    return this.vitalsRepo.save(vital);
  }

  async findAll(userId: string, page: number = 1, limit: number = 10, startDate?: string, endDate?: string) {
    const where: any = { userId };
    
    if (startDate && endDate) {
      where.recordedAt = Between(new Date(startDate), new Date(endDate));
    }

    const [items, total] = await this.vitalsRepo.findAndCount({
      where,
      order: { recordedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(userId: string, id: string, dto: UpdateVitalDto): Promise<Vital> {
    const vital = await this.vitalsRepo.findOne({ where: { id, userId } });
    if (!vital) throw new NotFoundException('Vital record not found');

    if (dto.weightKg || dto.heightCm) {
      const weight = dto.weightKg || vital.weightKg;
      const height = dto.heightCm || vital.heightCm;
      if (weight && height) {
        vital.bmi = Number((weight / Math.pow(height / 100, 2)).toFixed(2));
      }
    }

    Object.assign(vital, dto);
    if (dto.recordedAt) {
      vital.recordedAt = new Date(dto.recordedAt);
    }
    return this.vitalsRepo.save(vital);
  }

  async remove(userId: string, id: string): Promise<void> {
    const vital = await this.vitalsRepo.findOne({ where: { id, userId } });
    if (!vital) throw new NotFoundException('Vital record not found');
    await this.vitalsRepo.remove(vital);
  }
}
