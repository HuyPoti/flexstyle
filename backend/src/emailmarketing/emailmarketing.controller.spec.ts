import { Test, TestingModule } from '@nestjs/testing';
import { EmailmarketingController } from './emailmarketing.controller';

describe('EmailmarketingController', () => {
  let controller: EmailmarketingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailmarketingController],
    }).compile();

    controller = module.get<EmailmarketingController>(EmailmarketingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
