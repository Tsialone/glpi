import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>
  ) { }
  async create(createArticleDto: CreateArticleDto) {
    const instance = this.articleRepository.create({ ...createArticleDto, category: { id: createArticleDto.idCategory } as any });
    const saved = await this.articleRepository.save(instance);
    return saved;
  }

  async findAll() {
    return await this.articleRepository.find({relations:{
      category:true
    }});
  }

  async findOne(id: number) {
    return await this.articleRepository.findOneBy({ id });
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    return await this.articleRepository.update({ id }, updateArticleDto)
  }

  async remove(id: number) {
    return await this.articleRepository.delete(id);
  }
}
