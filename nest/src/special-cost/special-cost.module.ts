import { Module } from '@nestjs/common';
import { SpecialCostService } from './special-cost.service';
import { SpecialCostController } from './special-cost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialCost } from './entities/special-cost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpecialCost])],
  controllers: [SpecialCostController],
  providers: [SpecialCostService],
})
export class SpecialCostModule { }
