import { Module } from '@nestjs/common';
import { SanphamController } from './sanpham.controller';
import { SanphamService } from './sanpham.service';
import { PrismaModule } from 'src/prisma.module';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';

@Module({
  imports: [PrismaModule],
  controllers: [SanphamController],
  providers: [SanphamService, TaiKhoanGuard],
})
export class SanphamModule {}
