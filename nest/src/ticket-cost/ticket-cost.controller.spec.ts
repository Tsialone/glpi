import { Test, TestingModule } from '@nestjs/testing';
import { TicketCostController } from './ticket-cost.controller';
import { TicketCostService } from './ticket-cost.service';

describe('TicketCostController', () => {
  let controller: TicketCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketCostController],
      providers: [TicketCostService],
    }).compile();

    controller = module.get<TicketCostController>(TicketCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
