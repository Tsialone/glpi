import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusLangDto } from './create-status-lang.dto';

export class UpdateStatusLangDto extends PartialType(CreateStatusLangDto) {}
