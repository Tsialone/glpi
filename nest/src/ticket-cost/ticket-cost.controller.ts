import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketCostService } from './ticket-cost.service';
import { CreateTicketCostDto } from './dto/create-ticket-cost.dto';
import { UpdateTicketCostDto } from './dto/update-ticket-cost.dto';

@Controller('ticket-cost')
export class TicketCostController {
  constructor(private readonly ticketCostService: TicketCostService) {}

  @Post()
  create(@Body() createTicketCostDto: CreateTicketCostDto) {
    return this.ticketCostService.create(createTicketCostDto);
  }

  @Get()
  findAll() {
    return this.ticketCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketCostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketCostDto: UpdateTicketCostDto) {
    return this.ticketCostService.update(+id, updateTicketCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketCostService.remove(+id);
  }
}
