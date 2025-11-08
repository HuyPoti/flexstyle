import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { VoucherRepository } from '../repositories/voucher.repository';
import { ExcelService } from './excel.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VoucherController],
  providers: [VoucherService, VoucherRepository, ExcelService],
  exports: [VoucherRepository],
})
export class VoucherModule {}
