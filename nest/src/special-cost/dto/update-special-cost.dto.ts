import { PartialType } from '@nestjs/mapped-types';
import { CreateSpecialCostDto } from './create-special-cost.dto';

export class UpdateSpecialCostDto extends PartialType(CreateSpecialCostDto) {}
