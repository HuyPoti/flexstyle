import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaikhoanService } from './taikhoan.service';
import { TAIKHOAN } from './taikhoan.service';
import { Roles } from '../factory_function/role';
import { TaiKhoanGuard } from './taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

import { VaiTro, TrangThai } from './enums';
import { TaiKhoanNghiepVuDto, UpdateTaiKhoanKH } from './dto/taikhoannghiepvu.dto';


interface User {
  id: string;
  role: VaiTro;
}

@Controller('taikhoan')
export class KhachHangController {
  constructor(private readonly taikhoanService: TaikhoanService) {}

  // ============================================================
  // 🧍 KHÁCH HÀNG
  // ============================================================

  // Đăng ký khách hàng
  @Post('dangky')
  async dangKy(@Body() data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    return this.taikhoanService.dangKy(data);
  }

  // Lấy tất cả tài khoản khách hàng
  @Get()
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async getAll(): Promise<TAIKHOAN[]> {
    const tk = await this.taikhoanService.taikhoans();
    console.log('tk:', tk);
    return tk;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') maTK: string, @Req() req) {
    const user = req.user as User;
    const tk = await this.taikhoanService.taikhoan(maTK);
    const reqUser = await this.taikhoanService.taikhoan(user.id);
    // console.log(maTK, user.id);
    // console.log(user.role);

    if (user.id === maTK) return tk;
    if (
      reqUser?.VAITRO === 'QLDN' &&
      tk?.VAITRO !== 'ADMIN' &&
      tk?.VAITRO !== 'NCC'
    ) {
      return tk;
    }

    if (
      reqUser?.VAITRO === 'ADMIN' &&
      (tk?.VAITRO === 'QLDN' || tk?.VAITRO === 'NCC')
    ) {
      return tk;
    }

    throw new Error('Không có quyền truy cập');
  }

  @Put('/update/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') maTK: string,
    @Body() data: UpdateTaiKhoanKH,
    @Req() req,
  ): Promise<TAIKHOAN> {
    const user = req.user as User;
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (user.id === tk?.MaTK)
      return this.taikhoanService.updateTaiKhoan(maTK, data);
    throw new Error('Không có quyền cập nhật');
  }

  // Allow QLDN or ADMIN to change status of customer accounts (KH)
  @Patch('status/:id')
  @Roles('QLDN', 'ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async updateStatus(
    @Param('id') maTK: string,
    @Body('status') status: TrangThai,
    @Req() req,
  ) {
    const user = req.user as User;
    const tk = await this.taikhoanService.taikhoan(maTK);
    const reqUser = await this.taikhoanService.taikhoan(user.id);

    if (!tk) throw new Error('Không tìm thấy tài khoản');

    // QLDN may update KH accounts (not ADMIN/NCC)
    if (reqUser?.VAITRO === 'QLDN' && tk?.VAITRO === 'KH') {
      return this.taikhoanService.updateTrangThai(maTK, status);
    }

    // ADMIN can update any account status (keeps existing ADMIN behavior)
    if (reqUser?.VAITRO === 'ADMIN') {
      return this.taikhoanService.updateTrangThai(maTK, status);
    }

    throw new Error('Không có quyền cập nhật trạng thái');
  }
}
