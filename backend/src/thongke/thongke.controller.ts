import { Controller } from '@nestjs/common';
import { ThongkeService } from './thongke.service';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { Get, UseGuards } from '@nestjs/common/decorators';
import { Roles } from 'src/factory_function/role';

@Controller('thongke')
export class ThongkeController {
  constructor(private readonly thongkeService: ThongkeService) {}
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('doanhthu')
  async getDoanhThu() {
    return await this.thongkeService.getDoanhThu();
  }
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('khachhang')
  async getSLKhachHang() {
    return await this.thongkeService.getSLKhachHang();
  }
}
