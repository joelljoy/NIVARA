import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientProfile)
    private patientProfileRepo: Repository<PatientProfile>,
  ) {}

  async getProfile(userId: string): Promise<PatientProfile> {
    let profile = await this.patientProfileRepo.findOne({ where: { userId } });
    if (!profile) {
      // Auto-create empty profile
      profile = this.patientProfileRepo.create({ userId });
      await this.patientProfileRepo.save(profile);
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdatePatientProfileDto): Promise<PatientProfile> {
    const profile = await this.getProfile(userId);
    Object.assign(profile, dto);
    return this.patientProfileRepo.save(profile);
  }
}
