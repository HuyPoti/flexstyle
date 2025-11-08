import { Test, TestingModule } from '@nestjs/testing';
import { SanphamController } from './sanpham.controller';

describe('SanphamController', () => {
  let controller: SanphamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SanphamController],
    }).compile();

    controller = module.get<SanphamController>(SanphamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
