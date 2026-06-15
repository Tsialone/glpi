import { ConflictException, Injectable } from '@nestjs/common';
import { CreateStatusLangDto } from './dto/create-status-lang.dto';
import { UpdateStatusLangDto } from './dto/update-status-lang.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusLang } from './entities/status-lang.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StatusLangService {
  constructor(
    @InjectRepository(StatusLang)
    private readonly statusLangRepo: Repository<StatusLang>
  ) { }
  async create(createStatusLangDto: CreateStatusLangDto) {
    const instance = this.statusLangRepo.create(createStatusLangDto);
    const exist = await this.findByIdStatusAndLang(createStatusLangDto.lang, createStatusLangDto.id_status);
    if (exist) {
      throw new ConflictException ("Valeur déja existant pour cette status et lang");
    }
    return await this.statusLangRepo.save(instance);
  }
  async findByIdStatusAndLang(lang: string, idStatus: number) {
    return await this.statusLangRepo.findOneBy({ id_status: idStatus, lang: lang })
  }
  async findAll() {
    return await this.statusLangRepo.find();
  }

  async findOne(id: number) {
    return await this.statusLangRepo.findOneBy({ id: id });
  }

  async update(id: number, updateStatusLangDto: UpdateStatusLangDto) {
    return await this.statusLangRepo.update({ id: id }, updateStatusLangDto);
  }

  async remove(id: number) {
    return await this.statusLangRepo.delete({ id: id });
  }
}
