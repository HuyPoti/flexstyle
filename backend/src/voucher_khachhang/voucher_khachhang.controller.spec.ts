import { Test, TestingModule } from '@nestjs/testing';
import { VoucherKhachHangController } from './voucher_khachhang.controller';

describe('VoucherKhachHangController', () => {
  let controller: VoucherKhachHangController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherKhachHangController],
    }).compile();

    controller = module.get<VoucherKhachHangController>(VoucherKhachHangController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
