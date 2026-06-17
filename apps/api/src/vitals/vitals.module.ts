import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitalsService } from './vitals.service';
import { VitalsController } from './vitals.controller';
import { Vital } from './entities/vital.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vital])],
  controllers: [VitalsController],
  providers: [VitalsService],
  exports: [VitalsService],
})
export class VitalsModule {}
