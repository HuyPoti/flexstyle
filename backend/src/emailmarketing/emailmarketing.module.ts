import { Module } from '@nestjs/common';
import { EmailmarketingService } from './emailmarketing.service';
import { EmailmarketingController } from './emailmarketing.controller';

@Module({
  providers: [EmailmarketingService],
  controllers: [EmailmarketingController]
})
export class EmailmarketingModule {}
