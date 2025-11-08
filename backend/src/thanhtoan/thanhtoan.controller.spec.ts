import { Test, TestingModule } from '@nestjs/testing';
import { ThanhtoanController } from './thanhtoan.controller';

describe('ThanhtoanController', () => {
  let controller: ThanhtoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThanhtoanController],
    }).compile();

    controller = module.get<ThanhtoanController>(ThanhtoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
