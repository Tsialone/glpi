import { PartialType } from '@nestjs/mapped-types';
import { CreateStatusColorDto } from './create-status-color.dto';

export class UpdateStatusColorDto extends PartialType(CreateStatusColorDto) {}
