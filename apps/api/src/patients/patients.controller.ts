import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/dto/register.dto';

@ApiTags('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me/profile')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Get current patient profile' })
  async getProfile(@Request() req: any) {
    return {
      success: true,
      data: await this.patientsService.getProfile(req.user.userId),
    };
  }

  @Put('me/profile')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Update current patient profile' })
  async updateProfile(@Request() req: any, @Body() dto: UpdatePatientProfileDto) {
    return {
      success: true,
      data: await this.patientsService.updateProfile(req.user.userId, dto),
    };
  }
}
