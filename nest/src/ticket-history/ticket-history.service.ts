import { Injectable } from '@nestjs/common';
import { CreateTicketHistoryDto } from './dto/create-ticket-history.dto';
import { UpdateTicketHistoryDto } from './dto/update-ticket-history.dto';
import { Repository } from 'typeorm';
import { TicketHistory } from './entities/ticket-history.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TicketHistoryService {
  constructor(
    @InjectRepository(TicketHistory)
    private readonly ticketHistoryRepository: Repository<TicketHistory>
  ) { }
  create(createTicketHistoryDto: CreateTicketHistoryDto) {
    return this.ticketHistoryRepository.find();
  }

  findAll() {
    return this.ticketHistoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketHistory`;
  }

  update(id: number, updateTicketHistoryDto: UpdateTicketHistoryDto) {
    return `This action updates a #${id} ticketHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketHistory`;
  }
}
