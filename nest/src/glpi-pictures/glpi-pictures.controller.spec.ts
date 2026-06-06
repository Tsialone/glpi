import { Test, TestingModule } from '@nestjs/testing';
import { GlpiPicturesController } from './glpi-pictures.controller';

describe('GlpiPicturesController', () => {
  let controller: GlpiPicturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GlpiPicturesController],
    }).compile();

    controller = module.get<GlpiPicturesController>(GlpiPicturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
