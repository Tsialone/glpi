import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
const categoryEnums = ["super", "open" , "glpi"];
export class CreateSpecialCostDto {

    @IsNumber()
    id_ticket!: number;

    @IsString()
    @IsNotEmpty()
    item_type!: string;

    @IsNumber()
    id_item!: number;

    @IsString()
    @IsNotEmpty()
    @IsEnum(categoryEnums, { message: `category must be in ${categoryEnums}` })
    category!: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    created: Date = new Date();

    @IsNumber()
    value!: number;

    

}
