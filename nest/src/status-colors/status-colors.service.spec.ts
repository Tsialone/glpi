import { Test, TestingModule } from '@nestjs/testing';
import { StatusColorsService } from './status-colors.service';

describe('StatusColorsService', () => {
  let service: StatusColorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatusColorsService],
    }).compile();

    service = module.get<StatusColorsService>(StatusColorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
