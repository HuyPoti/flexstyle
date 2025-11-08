import { Test, TestingModule } from '@nestjs/testing';
import { PhieunhaphangController } from './phieunhaphang.controller';

describe('PhieunhaphangController', () => {
  let controller: PhieunhaphangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhieunhaphangController],
    }).compile();

    controller = module.get<PhieunhaphangController>(PhieunhaphangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
