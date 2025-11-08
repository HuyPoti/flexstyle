import { Test, TestingModule } from '@nestjs/testing';
import { SuKienUuDaiController } from './sukienuudai.controller';

describe('SukienuudaiController', () => {
  let controller: SuKienUuDaiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuKienUuDaiController],
    }).compile();

    controller = module.get<SuKienUuDaiController>(SuKienUuDaiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
