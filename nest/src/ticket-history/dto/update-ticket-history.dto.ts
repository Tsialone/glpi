import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketHistoryDto } from './create-ticket-history.dto';

export class UpdateTicketHistoryDto extends PartialType(CreateTicketHistoryDto) {}
