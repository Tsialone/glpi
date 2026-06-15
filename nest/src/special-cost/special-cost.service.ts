import { Injectable } from '@nestjs/common';
import { CreateSpecialCostDto } from './dto/create-special-cost.dto';
import { UpdateSpecialCostDto } from './dto/update-special-cost.dto';
import { Repository } from 'typeorm';
import { SpecialCost } from './entities/special-cost.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SpecialCostService {
  constructor(
    @InjectRepository(SpecialCost)
    private readonly sepcialCostRepo: Repository<SpecialCost>
  ) { }

  async getItemTypeDetail() {
    const ab = this.sepcialCostRepo.createQueryBuilder("sc");
    const result =
      await
        ab
          .select(["*"])
          // .addSelect("SUM (value)", "cost")
          // .where("category = 'glpi'")
          .groupBy("item_type , category, created")
          .getRawMany();
    return result.length > 0 ? result : [];
  }
  async getItemTypesGlpiCost() {
    const ab = this.sepcialCostRepo.createQueryBuilder("sc");
    const result =
      await
        ab
          .select(["item_type"])
          .addSelect("SUM (value)", "cost")
          .where("category = 'glpi'")
          .groupBy("item_type")
          .getRawMany();
    return result.length > 0 ? result : [];
  }
  async getItemTypesOpenCost() {
    const ab = this.sepcialCostRepo.createQueryBuilder("sc");
    const result =
      await
        ab
          .select(["item_type"])
          .addSelect("SUM (value)", "cost")
          .where("category = 'open'")
          .groupBy("item_type")
          .getRawMany();
    return result.length > 0 ? result : [];
  }


  async getItemTypesSuperCost() {
    const ab = this.sepcialCostRepo.createQueryBuilder("sc");
    const result =
      await
        ab
          .select(["item_type"])
          .addSelect("SUM (value)", "cost")
          .where("category = 'super'")
          .groupBy("item_type")
          .getRawMany();
          
    return result.length > 0 ? result : [];
  }

  async create(createSpecialCostDto: CreateSpecialCostDto) {
    const instance = this.sepcialCostRepo.create(createSpecialCostDto);
    return await this.sepcialCostRepo.save(instance);
  }

  async findAll() {
    return await this.sepcialCostRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} specialCost`;
  }

  update(id: number, updateSpecialCostDto: UpdateSpecialCostDto) {
    return `This action updates a #${id} specialCost`;
  }

  async remove(id: number) {
    return await this.sepcialCostRepo.delete(id);
  }
}