import { Module } from '@nestjs/common';
import { StatusColorsService } from './status-colors.service';
import { StatusColorsController } from './status-colors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusColor } from './entities/status-color.entity';

@Module({
  imports: [TypeOrmModule.forFeature ([StatusColor])],
  controllers: [StatusColorsController],
  providers: [StatusColorsService],
})
export class StatusColorsModule {}
