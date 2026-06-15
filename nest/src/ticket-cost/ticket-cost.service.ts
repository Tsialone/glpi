import { Injectable } from '@nestjs/common';
import { CreateTicketCostDto } from './dto/create-ticket-cost.dto';
import { UpdateTicketCostDto } from './dto/update-ticket-cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketCost } from './entities/ticket-cost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TicketCostService {
  constructor(
    @InjectRepository(TicketCost)
    private readonly ticketCostRepo: Repository<TicketCost>
  ) {

  }
  async create(createTicketCostDto: CreateTicketCostDto) {
    const instance = this.ticketCostRepo.create(createTicketCostDto);
    return await this.ticketCostRepo.save(instance);
  }

  async findAll() {
    return this.ticketCostRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketCost`;
  }

  update(id: number, updateTicketCostDto: UpdateTicketCostDto) {
    return `This action updates a #${id} ticketCost`;
  }

  remove(id: number) {
    return this.ticketCostRepo.delete({ id: id })
  }
}
