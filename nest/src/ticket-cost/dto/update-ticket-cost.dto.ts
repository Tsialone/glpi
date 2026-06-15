import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketCostDto } from './create-ticket-cost.dto';

export class UpdateTicketCostDto extends PartialType(CreateTicketCostDto) {}
