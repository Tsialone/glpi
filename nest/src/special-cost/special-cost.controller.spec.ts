import { Test, TestingModule } from '@nestjs/testing';
import { SpecialCostController } from './special-cost.controller';
import { SpecialCostService } from './special-cost.service';

describe('SpecialCostController', () => {
  let controller: SpecialCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialCostController],
      providers: [SpecialCostService],
    }).compile();

    controller = module.get<SpecialCostController>(SpecialCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
