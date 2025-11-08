import { Test, TestingModule } from '@nestjs/testing';
import { SanphamService } from './sanpham.service';

describe('SanphamService', () => {
  let service: SanphamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SanphamService],
    }).compile();

    service = module.get<SanphamService>(SanphamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
