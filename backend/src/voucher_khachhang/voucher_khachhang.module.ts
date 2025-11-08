import { Module } from '@nestjs/common';
import { VoucherKhachHangController } from './voucher_khachhang.controller';
import { VoucherKhachHangService } from './voucher_khachhang.service';
import { VoucherKhachHangRepository } from '../repositories/voucher_khachhang.repository';
import { VoucherRepository } from '../repositories/voucher.repository';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VoucherKhachHangController],
  providers: [VoucherKhachHangService, VoucherKhachHangRepository, VoucherRepository],
  exports: [VoucherKhachHangRepository],
})
export class VoucherKhachHangModule {}
