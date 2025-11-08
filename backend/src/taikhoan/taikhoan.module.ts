import { Module } from '@nestjs/common';
import { TaikhoanService } from './taikhoan.service';
import { KhachHangController } from './khachhang.controller';
import { NhanVienController } from './nhanvien.controller';
import { NhaCungCapController } from './nhacungcap.controller';
import { QuanLyController } from './quanly.controller';
import { GiohangRepository } from 'src/repositories/giohang.repository';
import { PrismaService } from 'src/prisma.service';
@Module({
  controllers: [
    KhachHangController,
    NhaCungCapController,
    QuanLyController,
    NhanVienController,
  ],
  providers: [TaikhoanService, GiohangRepository, PrismaService],
})
export class TaikhoanModule {}
