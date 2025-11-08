import { Test, TestingModule } from '@nestjs/testing';
import { PhanhoiController } from './phanhoi.controller';

describe('PhanhoiController', () => {
  let controller: PhanhoiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhanhoiController],
    }).compile();

    controller = module.get<PhanhoiController>(PhanhoiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
