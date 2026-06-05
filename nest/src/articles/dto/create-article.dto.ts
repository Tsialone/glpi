import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty ()
    name!: string

    @IsString()
    description!: string

    @IsNumber()
    @IsNotEmpty()
    idCategory!: number
}
