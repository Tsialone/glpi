import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTicketHistoryDto {
    @IsNotEmpty()
    id_ticket!: number;

    @IsNotEmpty()
    comment!: string;

    @IsNotEmpty()
    id_action!: number;

    @IsOptional()
    created?: Date;
}
