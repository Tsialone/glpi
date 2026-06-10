import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusColorsService } from './status-colors.service';
import { CreateStatusColorDto } from './dto/create-status-color.dto';
import { UpdateStatusColorDto } from './dto/update-status-color.dto';

@Controller('status-colors')
export class StatusColorsController {
  constructor(private readonly statusColorsService: StatusColorsService) {}

  @Post()
  create(@Body() createStatusColorDto: CreateStatusColorDto) {
    return this.statusColorsService.create(createStatusColorDto);
  }

  @Get()
  findAll() {
    return this.statusColorsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusColorsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusColorDto: UpdateStatusColorDto) {
    return this.statusColorsService.update(+id, updateStatusColorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusColorsService.remove(+id);
  }
}
