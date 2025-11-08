import { Test, TestingModule } from '@nestjs/testing';
import { ThanhtoanService } from './thanhtoan.service';

describe('ThanhtoanService', () => {
  let service: ThanhtoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThanhtoanService],
    }).compile();

    service = module.get<ThanhtoanService>(ThanhtoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
