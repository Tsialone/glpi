import { Test, TestingModule } from '@nestjs/testing';
import { OpenCostService } from './open_cost.service';

describe('OpenCostService', () => {
  let service: OpenCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenCostService],
    }).compile();

    service = module.get<OpenCostService>(OpenCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
