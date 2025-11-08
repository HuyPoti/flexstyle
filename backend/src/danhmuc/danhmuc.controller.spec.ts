import { Test, TestingModule } from '@nestjs/testing';
import { DanhMucController } from './danhmuc.controller';

describe('DanhMucController', () => {
  let controller: DanhMucController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DanhMucController],
    }).compile();

    controller = module.get<DanhMucController>(DanhMucController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
