import { Test, TestingModule } from '@nestjs/testing';
import { EmailmarketingService } from './emailmarketing.service';

describe('EmailmarketingService', () => {
  let service: EmailmarketingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailmarketingService],
    }).compile();

    service = module.get<EmailmarketingService>(EmailmarketingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
