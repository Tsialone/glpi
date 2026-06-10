import { IsHexColor, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateStatusColorDto {
    @IsNumber ()
    id_status!: number;

    @IsString ()
    @IsNotEmpty ()
    @IsHexColor ()
    color!: string;
}
