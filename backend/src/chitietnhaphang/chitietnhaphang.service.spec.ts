import { Test, TestingModule } from '@nestjs/testing';
import { ChitietnhaphangService } from './chitietnhaphang.service';

describe('ChitietnhaphangService', () => {
  let service: ChitietnhaphangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChitietnhaphangService],
    }).compile();

    service = module.get<ChitietnhaphangService>(ChitietnhaphangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
