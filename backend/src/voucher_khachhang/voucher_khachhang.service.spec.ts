import { Test, TestingModule } from '@nestjs/testing';
import { VoucherKhachHangService } from './voucher_khachhang.service';

describe('VoucherKhachHangService', () => {
  let service: VoucherKhachHangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherKhachHangService],
    }).compile();

    service = module.get<VoucherKhachHangService>(VoucherKhachHangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
