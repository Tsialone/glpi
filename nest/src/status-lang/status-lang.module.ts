import { Module } from '@nestjs/common';
import { StatusLangService } from './status-lang.service';
import { StatusLangController } from './status-lang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusLang } from './entities/status-lang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StatusLang])],
  controllers: [StatusLangController],
  providers: [StatusLangService],
})
export class StatusLangModule { }
