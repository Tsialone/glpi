import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
const idStatus = [1, 2, 6];
export class CreateStatusLangDto {
    @IsString()
    @IsNotEmpty()
    lang!: string;

    @IsNumber()
    @IsEnum(idStatus, { message: `id_status doit etre dans ${idStatus}` })
    id_status!: number;

    @IsString()
    @IsNotEmpty()
    value!: string;
}
