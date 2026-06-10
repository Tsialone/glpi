import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TicketHistoryService } from './ticket-history.service';
import { CreateTicketHistoryDto } from './dto/create-ticket-history.dto';
import { UpdateTicketHistoryDto } from './dto/update-ticket-history.dto';

@Controller('ticket-history')
export class TicketHistoryController {
  constructor(private readonly ticketHistoryService: TicketHistoryService) {}

  @Post()
  create(@Body() createTicketHistoryDto: CreateTicketHistoryDto) {
    return this.ticketHistoryService.create(createTicketHistoryDto);
  }

  @Get()
  findAll() {
    return this.ticketHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketHistoryDto: UpdateTicketHistoryDto) {
    return this.ticketHistoryService.update(+id, updateTicketHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketHistoryService.remove(+id);
  }
}
