import { Test, TestingModule } from '@nestjs/testing';
import { StatusLangService } from './status-lang.service';

describe('StatusLangService', () => {
  let service: StatusLangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusLangService],
    }).compile();

    service = module.get<StatusLangService>(StatusLangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
