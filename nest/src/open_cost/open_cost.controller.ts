import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OpenCostService } from './open_cost.service';
import { CreateOpenCostDto } from './dto/create-open_cost.dto';
import { UpdateOpenCostDto } from './dto/update-open_cost.dto';

@Controller('open-cost')
export class OpenCostController {
  constructor(private readonly openCostService: OpenCostService) {}

  @Post()
  create(@Body() createOpenCostDto: CreateOpenCostDto) {
    return this.openCostService.create(createOpenCostDto);
  }

  @Get()
  findAll() {
    return this.openCostService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.openCostService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpenCostDto: UpdateOpenCostDto) {
    return this.openCostService.update(+id, updateOpenCostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.openCostService.remove(+id);
  }
}
