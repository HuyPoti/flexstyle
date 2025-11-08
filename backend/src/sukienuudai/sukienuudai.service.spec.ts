import { Test, TestingModule } from '@nestjs/testing';
import { SuKienUuDaiService } from './sukienuudai.service';

describe('SuKienUuDaiService', () => {
  let service: SuKienUuDaiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuKienUuDaiService],
    }).compile();

    service = module.get<SuKienUuDaiService>(SuKienUuDaiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
