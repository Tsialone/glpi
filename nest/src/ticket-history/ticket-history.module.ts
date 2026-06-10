import { Module } from '@nestjs/common';
import { TicketHistoryService } from './ticket-history.service';
import { TicketHistoryController } from './ticket-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketHistory } from './entities/ticket-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketHistory
    ])
  ],
  controllers: [TicketHistoryController],
  providers: [TicketHistoryService],
})
export class TicketHistoryModule { }
