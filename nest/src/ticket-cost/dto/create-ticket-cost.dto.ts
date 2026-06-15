import { IsNumber, isNumber } from "class-validator";

export class CreateTicketCostDto {

    @IsNumber()
    id_ticket!: number;

    @IsNumber()
    super_cost!: number;
}
