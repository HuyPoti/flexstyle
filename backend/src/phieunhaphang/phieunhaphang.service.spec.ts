import { Test, TestingModule } from '@nestjs/testing';
import { PhieunhaphangService } from './phieunhaphang.service';

describe('PhieunhaphangService', () => {
  let service: PhieunhaphangService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhieunhaphangService],
    }).compile();

    service = module.get<PhieunhaphangService>(PhieunhaphangService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
