import { Test, TestingModule } from '@nestjs/testing';
import { GlpiPicturesService } from './glpi-pictures.service';

describe('GlpiPicturesService', () => {
  let service: GlpiPicturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlpiPicturesService],
    }).compile();

    service = module.get<GlpiPicturesService>(GlpiPicturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
