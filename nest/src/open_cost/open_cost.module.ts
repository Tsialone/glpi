import { Module } from '@nestjs/common';
import { OpenCostService } from './open_cost.service';
import { OpenCostController } from './open_cost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenCost } from './entities/open_cost.entity';

@Module({
  imports : [TypeOrmModule.forFeature ([OpenCost])],
  controllers: [OpenCostController],
  providers: [OpenCostService],
})
export class OpenCostModule {}
