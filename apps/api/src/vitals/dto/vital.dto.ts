import { IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class CreateVitalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bloodPressureSystolic?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bloodPressureDiastolic?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bloodSugarFasting?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bloodSugarPostMeal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  oxygenSaturation?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  heightCm?: number;

  @ApiProperty()
  @IsDateString()
  recordedAt: string;
}

export class UpdateVitalDto extends CreateVitalDto {}
