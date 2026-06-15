import { IsNumber } from "class-validator";

export class CreateOpenCostDto {

    @IsNumber()
    id_ticket!: number;

    @IsNumber()
    cost!: number;
}
