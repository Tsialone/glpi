import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { AppDataSource } from './data-source';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ArticlesModule,
    CategoriesModule,
  ],
})
export class AppModule { }
