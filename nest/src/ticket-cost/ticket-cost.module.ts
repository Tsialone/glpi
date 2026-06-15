import { Module } from '@nestjs/common';
import { TicketCostService } from './ticket-cost.service';
import { TicketCostController } from './ticket-cost.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketCost } from './entities/ticket-cost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketCost])],
  controllers: [TicketCostController],
  providers: [TicketCostService],
})
export class TicketCostModule { }
