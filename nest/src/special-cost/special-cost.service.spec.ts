import { Test, TestingModule } from '@nestjs/testing';
import { SpecialCostService } from './special-cost.service';

describe('SpecialCostService', () => {
  let service: SpecialCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialCostService],
    }).compile();

    service = module.get<SpecialCostService>(SpecialCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
