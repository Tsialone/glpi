import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesModule } from './articles/articles.module';
import { AppDataSource } from './data-source';
import { CategoriesModule } from './categories/categories.module';
import { GlpiPicturesController } from './glpi-pictures/glpi-pictures.controller';
import { GlpiPicturesService } from './glpi-pictures/glpi-pictures.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
    ArticlesModule,
    CategoriesModule,
  ],
  controllers: [GlpiPicturesController],
  providers: [GlpiPicturesService],
})
export class AppModule { }
