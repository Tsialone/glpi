import { Test, TestingModule } from '@nestjs/testing';
import { StatusLangController } from './status-lang.controller';
import { StatusLangService } from './status-lang.service';

describe('StatusLangController', () => {
  let controller: StatusLangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusLangController],
      providers: [StatusLangService],
    }).compile();

    controller = module.get<StatusLangController>(StatusLangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
