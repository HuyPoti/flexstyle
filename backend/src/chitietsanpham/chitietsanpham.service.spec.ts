import { Test, TestingModule } from '@nestjs/testing';
import { ChitietsanphamService } from './chitietsanpham.service';

describe('ChitietsanphamService', () => {
  let service: ChitietsanphamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChitietsanphamService],
    }).compile();

    service = module.get<ChitietsanphamService>(ChitietsanphamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
