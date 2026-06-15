import { Test, TestingModule } from '@nestjs/testing';
import { OpenCostController } from './open_cost.controller';
import { OpenCostService } from './open_cost.service';

describe('OpenCostController', () => {
  let controller: OpenCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpenCostController],
      providers: [OpenCostService],
    }).compile();

    controller = module.get<OpenCostController>(OpenCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
