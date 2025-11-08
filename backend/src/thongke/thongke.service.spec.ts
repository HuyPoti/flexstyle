import { Test, TestingModule } from '@nestjs/testing';
import { ThongkeService } from './thongke.service';

describe('ThongkeService', () => {
  let service: ThongkeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThongkeService],
    }).compile();

    service = module.get<ThongkeService>(ThongkeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
