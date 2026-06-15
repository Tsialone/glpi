import { Test, TestingModule } from '@nestjs/testing';
import { TicketCostService } from './ticket-cost.service';

describe('TicketCostService', () => {
  let service: TicketCostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketCostService],
    }).compile();

    service = module.get<TicketCostService>(TicketCostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
