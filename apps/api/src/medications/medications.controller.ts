import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { MedicationsService } from './medications.service';
import { CreateMedicationDto, UpdateMedicationDto } from './dto/medication.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/dto/register.dto';

@ApiTags('medications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medications')
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  @Roles(Role.PATIENT, Role.DOCTOR)
  @ApiOperation({ summary: 'Add a new medication' })
  async create(@Request() req: any, @Body() createMedicationDto: CreateMedicationDto) {
    return {
      success: true,
      data: await this.medicationsService.create(req.user.userId, createMedicationDto),
    };
  }

  @Get('active')
  @Roles(Role.PATIENT, Role.DOCTOR, Role.FAMILY_CAREGIVER)
  @ApiOperation({ summary: 'Get active medications' })
  async findActive(@Request() req: any) {
    return {
      success: true,
      data: await this.medicationsService.findAllActive(req.user.userId),
    };
  }

  @Get('history')
  @Roles(Role.PATIENT, Role.DOCTOR, Role.FAMILY_CAREGIVER)
  @ApiOperation({ summary: 'Get all medications history' })
  async findHistory(@Request() req: any) {
    return {
      success: true,
      data: await this.medicationsService.findAllHistory(req.user.userId),
    };
  }

  @Put(':id')
  @Roles(Role.PATIENT, Role.DOCTOR)
  @ApiOperation({ summary: 'Update a medication' })
  async update(@Request() req: any, @Param('id') id: string, @Body() updateMedicationDto: UpdateMedicationDto) {
    return {
      success: true,
      data: await this.medicationsService.update(req.user.userId, id, updateMedicationDto),
    };
  }

  @Delete(':id')
  @Roles(Role.PATIENT, Role.DOCTOR)
  @ApiOperation({ summary: 'Delete a medication' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.medicationsService.remove(req.user.userId, id);
    return { success: true, message: 'Medication deleted' };
  }

  @Patch(':id/refill')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Request a refill for a medication' })
  async requestRefill(@Request() req: any, @Param('id') id: string) {
    return {
      success: true,
      data: await this.medicationsService.requestRefill(req.user.userId, id),
    };
  }
}
