import { Test, TestingModule } from '@nestjs/testing';
import { ChitietsanphamController } from './chitietsanpham.controller';

describe('ChitietsanphamController', () => {
  let controller: ChitietsanphamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChitietsanphamController],
    }).compile();

    controller = module.get<ChitietsanphamController>(ChitietsanphamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
