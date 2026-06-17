import { IsEmail, IsString, MinLength, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Role {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  HOSPITAL_ADMIN = 'hospital_admin',
  FAMILY_CAREGIVER = 'family_caregiver',
  INSURANCE_REVIEWER = 'insurance_reviewer',
}

export class RegisterDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
