import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStatusColorDto } from './dto/create-status-color.dto';
import { UpdateStatusColorDto } from './dto/update-status-color.dto';
import { Repository } from 'typeorm';
import { StatusColor } from './entities/status-color.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatusColorsService {
  constructor(
    @InjectRepository(StatusColor)
    private readonly statusRepo: Repository<StatusColor>
  ) { }

  async create(createStatusColorDto: CreateStatusColorDto) {
    try {
      const instance = this.statusRepo.create(createStatusColorDto);
      const ifExist = await this.findByIdStatus(createStatusColorDto.id_status);
      if (ifExist) throw new ConflictException(`status_id ${createStatusColorDto.id_status} existe déja`);
      if (createStatusColorDto.id_status)
        return await this.statusRepo.save(instance);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.statusRepo.find();
  }

  async findByIdStatus(idStatus: number) {
    return this.statusRepo.findOneBy({ id_status: +idStatus });
  }
  async findOne(id: number) {
    return this.statusRepo.findOneBy({ id: +id });
  }

  async update(id: number, updateStatusColorDto: UpdateStatusColorDto) {
    return await this.statusRepo.update({ id: id }, updateStatusColorDto);
  }

  async remove(id: number) {
    return await this.statusRepo.delete(id);
  }
}
