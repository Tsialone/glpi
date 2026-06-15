import { PartialType } from '@nestjs/mapped-types';
import { CreateOpenCostDto } from './create-open_cost.dto';

export class UpdateOpenCostDto extends PartialType(CreateOpenCostDto) {}
