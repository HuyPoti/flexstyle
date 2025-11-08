import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TaikhoanService } from './taikhoan.service';
import { TAIKHOAN } from './taikhoan.service';
import { Roles } from '../factory_function/role';
import { TaiKhoanGuard } from './taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import {
  TaiKhoanNghiepVuDto,
  UpdateTaiKhoanNghiepVuDto,
} from './dto/taikhoannghiepvu.dto';
import { TrangThai } from './enums';
// Define enums locally

@Controller('ncc')
export class NhaCungCapController {
  constructor(private readonly taikhoanService: TaikhoanService) {}

  // ============================================================
  // 🏢 NHÀ CUNG CẤP (NCC)
  // ============================================================

  @Post('dangky')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async dangKyNCC(@Body() data: TaiKhoanNghiepVuDto): Promise<TAIKHOAN> {
    return this.taikhoanService.dangKyNCC(data);
  }

  @Get()
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async getAllNCC(): Promise<TAIKHOAN[]> {
    return this.taikhoanService.taikhoansNCC();
  }

  // Public list of suppliers (minimal fields) - no auth required so frontend can populate selects
  @Get('public')
  async getPublicNCC() {
    const list = await this.taikhoanService.taikhoansNCC();
    // return only minimal fields to avoid leaking sensitive info
    return list.map((s) => ({ MaTK: s.MaTK, DisplayName: s.DisplayName, Email: s.Email, VAITRO: s.VAITRO }));
  }

  @Get(':id')
  @Roles('ADMIN', 'NCC')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async getNCC(@Param('id') maTK: string): Promise<TAIKHOAN> {
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO !== 'NCC') throw new Error('Không tìm thấy tài khoản NCC');
    return tk;
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async updateNCC(
    @Param('id') maTK: string,
    @Body() data: UpdateTaiKhoanNghiepVuDto,
  ) {
    console.log('Updating NCC with data:', data);
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO !== 'NCC') throw new Error('Không tìm thấy NCC');
    return this.taikhoanService.updateTaiKhoan(maTK, data);
  }

  @Patch('status/:id')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  async updateStatusNCC(
    @Param('id') maTK: string,
    @Body('status') status: TrangThai,
  ): Promise<TAIKHOAN> {
    const tk = await this.taikhoanService.taikhoan(maTK);
    if (tk?.VAITRO !== 'NCC') throw new Error('Không tìm thấy NCC');
    return this.taikhoanService.updateTrangThai(maTK, status);
  }
}
