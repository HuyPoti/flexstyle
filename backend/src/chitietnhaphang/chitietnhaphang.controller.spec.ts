import { Test, TestingModule } from '@nestjs/testing';
import { ChitietnhaphangController } from './chitietnhaphang.controller';

describe('ChitietnhaphangController', () => {
  let controller: ChitietnhaphangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChitietnhaphangController],
    }).compile();

    controller = module.get<ChitietnhaphangController>(ChitietnhaphangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
