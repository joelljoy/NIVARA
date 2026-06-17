import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { VitalsService } from './vitals.service';
import { CreateVitalDto, UpdateVitalDto } from './dto/vital.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/dto/register.dto';

@ApiTags('vitals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Post()
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Record new vitals' })
  async create(@Request() req: any, @Body() createVitalDto: CreateVitalDto) {
    return {
      success: true,
      data: await this.vitalsService.create(req.user.userId, createVitalDto),
    };
  }

  @Get()
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Get vital history' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  async findAll(
    @Request() req: any,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return {
      success: true,
      data: await this.vitalsService.findAll(
        req.user.userId,
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 10,
        startDate,
        endDate,
      ),
    };
  }

  @Put(':id')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Update vital record' })
  async update(@Request() req: any, @Param('id') id: string, @Body() updateVitalDto: UpdateVitalDto) {
    return {
      success: true,
      data: await this.vitalsService.update(req.user.userId, id, updateVitalDto),
    };
  }

  @Delete(':id')
  @Roles(Role.PATIENT)
  @ApiOperation({ summary: 'Delete vital record' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.vitalsService.remove(req.user.userId, id);
    return { success: true, message: 'Record deleted' };
  }
}
