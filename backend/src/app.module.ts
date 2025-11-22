import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DanhMucModule } from './danhmuc/danhmuc.module';
import { SuKienUuDaiModule } from './sukienuudai/sukienuudai.module';
import { SanphamModule } from './sanpham/sanpham.module';
import { ChitietsanphamModule } from './chitietsanpham/chitietsanpham.module';
import { ChitietnhaphangModule } from './chitietnhaphang/chitietnhaphang.module';
import { GiohangModule } from './giohang/giohang.module';
import { DonhangModule } from './donhang/donhang.module';
import { TinhtrangDonhangModule } from './tinhtrangdonhang/tinhtrangdonhang.module';
import { VoucherModule } from './voucher/voucher.module';
import { TaikhoanService } from './taikhoan/taikhoan.service';
import { KhachHangController } from './taikhoan/khachhang.controller';
import { NhanVienController } from './taikhoan/nhanvien.controller';
import { QuanLyController } from './taikhoan/quanly.controller';
import { NhaCungCapController } from './taikhoan/nhacungcap.controller';
import { TaikhoanModule } from './taikhoan/taikhoan.module';
import { VoucherKhachHangModule } from './voucher_khachhang/voucher_khachhang.module';
import { PhanHoiModule } from './phanhoi/phanhoi.module';
import { PhieuNhapHangModule } from './phieunhaphang/phieunhaphang.module';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { PaypalModule } from './paypal/paypal.module';
import { VNPAYModule } from './vnpay/vnpay.module';
import { ThanhtoanModule } from './thanhtoan/thanhtoan.module';
import { ThongbaoModule } from './thongbao/thongbao.module';
import { GeminiModule } from './gemini/gemini.module';
import { ThongkeController } from './thongke/thongke.controller';
import { ThongkeService } from './thongke/thongke.service';
import { ThongkeModule } from './thongke/thongke.module';
import { EmailmarketingModule } from './emailmarketing/emailmarketing.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    // Prisma module phải đứng trước để các service khác inject PrismaService
    // PrismaModule,
    PaypalModule,
    DanhMucModule,
    SuKienUuDaiModule,
    SanphamModule,
    ChitietsanphamModule,
  ChitietnhaphangModule,
    GiohangModule,
    DonhangModule,
    TinhtrangDonhangModule,
    VoucherModule,
    TaikhoanModule,
    VoucherKhachHangModule,
    PhanHoiModule,
    PhieuNhapHangModule,
    VNPAYModule,
    ThanhtoanModule,
    ThongbaoModule,
    GeminiModule,
    ThongkeModule,
    EmailmarketingModule,
  ],
  controllers: [
    AppController,
    KhachHangController,
    NhanVienController,
    QuanLyController,
    NhaCungCapController,
    ThongkeController,
  ],
  providers: [AppService, TaikhoanService, JwtService, ThongkeService],
})
export class AppModule {
  constructor() {
    // Sentinel log to verify recompilation
    console.log(
      '[AppModule] Bootstrapping with modules: DanhMuc, Sukienuudai, Sanpham, ChitietSanpham, Giohang, Donhang, TinhtrangDonhang, Voucher, VoucherKhachhang - V9',
    );
  }
}
