import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StatusLangService } from './status-lang.service';
import { CreateStatusLangDto } from './dto/create-status-lang.dto';
import { UpdateStatusLangDto } from './dto/update-status-lang.dto';

@Controller('status-lang')
export class StatusLangController {
  constructor(private readonly statusLangService: StatusLangService) {}

  @Post()
  create(@Body() createStatusLangDto: CreateStatusLangDto) {
    return this.statusLangService.create(createStatusLangDto);
  }

  @Get()
  findAll() {
    return this.statusLangService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusLangService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStatusLangDto: UpdateStatusLangDto) {
    return this.statusLangService.update(+id, updateStatusLangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusLangService.remove(+id);
  }
}
