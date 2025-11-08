import { Test, TestingModule } from '@nestjs/testing';
import { TaikhoanService } from './taikhoan.service';

describe('TaikhoanService', () => {
  let service: TaikhoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaikhoanService],
    }).compile();

    service = module.get<TaikhoanService>(TaikhoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
