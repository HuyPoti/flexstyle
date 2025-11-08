import { Test, TestingModule } from '@nestjs/testing';
import { PhanhoiService } from './phanhoi.service';

describe('PhanhoiService', () => {
  let service: PhanhoiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhanhoiService],
    }).compile();

    service = module.get<PhanhoiService>(PhanhoiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
