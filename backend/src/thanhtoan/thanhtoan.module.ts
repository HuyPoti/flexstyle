import { Module } from '@nestjs/common';
import { ThanhtoanService } from './thanhtoan.service';
import { ThanhtoanController } from './thanhtoan.controller';
import { ThanhtoanRepository } from 'src/repositories/thanhtoan.repository';
import { DonhangRepository } from 'src/repositories/donhang.repository';

@Module({
  controllers: [ThanhtoanController],
  providers: [ThanhtoanService, ThanhtoanRepository, DonhangRepository],
  exports: [ThanhtoanRepository],
})
export class ThanhtoanModule {}
