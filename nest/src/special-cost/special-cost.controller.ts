import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecialCostService } from './special-cost.service';
import { CreateSpecialCostDto } from './dto/create-special-cost.dto';
import { UpdateSpecialCostDto } from './dto/update-special-cost.dto';

@Controller('special-cost')
export class SpecialCostController {
  constructor(private readonly specialCostService: SpecialCostService) { }

  @Get("/detail-cost")
  findDetailCost() {
    return this.specialCostService.getItemTypeDetail();
  }
  @Get("/open-cost")
  findOpenCost() {
    return this.specialCostService.getItemTypesOpenCost();
  }
  @Get("/super-cost")
  findSuperCost() {
    return this.specialCostService.getItemTypesSuperCost();
  }
  @Get("/glpi-cost")
  findGlpiCost() {
    return this.specialCostService.getItemTypesGlpiCost();
  }

  @Post()
  create(@Body() createSpecialCostDto: CreateSpecialCostDto) {
    return this.specialCostService.create(createSpecialCostDto);
  }

  @Get()
  findAll() {
    return this.specialCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialCostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpecialCostDto: UpdateSpecialCostDto) {
    return this.specialCostService.update(+id, updateSpecialCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialCostService.remove(+id);
  }
}
