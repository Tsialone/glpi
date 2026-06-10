import { Test, TestingModule } from '@nestjs/testing';
import { StatusColorsController } from './status-colors.controller';
import { StatusColorsService } from './status-colors.service';

describe('StatusColorsController', () => {
  let controller: StatusColorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusColorsController],
      providers: [StatusColorsService],
    }).compile();

    controller = module.get<StatusColorsController>(StatusColorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
