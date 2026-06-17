import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto/appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/dto/register.dto';

@ApiTags('appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Book a new appointment' })
  async create(@Request() req: any, @Body() createAppointmentDto: CreateAppointmentDto) {
    return {
      success: true,
      data: await this.appointmentsService.create(req.user.userId, createAppointmentDto),
    };
  }

  @Get('upcoming')
  @Roles(Role.PATIENT, Role.DOCTOR)
  @ApiOperation({ summary: 'Get upcoming appointments' })
  async findUpcoming(@Request() req: any) {
    return {
      success: true,
      data: await this.appointmentsService.findUpcoming(req.user.userId, req.user.role),
    };
  }

  @Get('history')
  @Roles(Role.PATIENT, Role.DOCTOR)
  @ApiOperation({ summary: 'Get past/completed/cancelled appointments' })
  async findHistory(@Request() req: any) {
    return {
      success: true,
      data: await this.appointmentsService.findHistory(req.user.userId, req.user.role),
    };
  }

  @Put(':id')
  @Roles(Role.PATIENT, Role.DOCTOR)
  @ApiOperation({ summary: 'Update or reschedule appointment' })
  async update(@Request() req: any, @Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    return {
      success: true,
      data: await this.appointmentsService.update(req.user.userId, req.user.role, id, updateAppointmentDto),
    };
  }
}
