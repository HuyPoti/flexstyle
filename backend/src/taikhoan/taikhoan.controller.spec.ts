import { Test, TestingModule } from '@nestjs/testing';
import { TaikhoanController } from './khachhang.controller';

describe('TaikhoanController', () => {
  let controller: TaikhoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaikhoanController],
    }).compile();

    controller = module.get<TaikhoanController>(TaikhoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
