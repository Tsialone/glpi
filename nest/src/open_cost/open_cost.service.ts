import { Injectable } from '@nestjs/common';
import { CreateOpenCostDto } from './dto/create-open_cost.dto';
import { UpdateOpenCostDto } from './dto/update-open_cost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OpenCost } from './entities/open_cost.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OpenCostService {
  constructor(
    @InjectRepository(OpenCost)
    private readonly openCostRepo: Repository<OpenCost>
  ) { }
  async create(createOpenCostDto: CreateOpenCostDto) {
    const instance = this.openCostRepo.create(createOpenCostDto);
    return await this.openCostRepo.save(instance);
  }

  async findAll() {
    return await this.openCostRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} openCost`;
  }

  update(id: number, updateOpenCostDto: UpdateOpenCostDto) {
    return `This action updates a #${id} openCost`;
  }

  remove(id: number) {
    return  this.openCostRepo.delete ({id:id});
  }
}
