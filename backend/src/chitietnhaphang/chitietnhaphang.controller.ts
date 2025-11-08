import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ChitietnhaphangService } from './chitietnhaphang.service';
import { CreateChiTietNhapHangDto } from './dto/create-chitietnhaphang.dto';
import { Roles } from 'src/factory_function/role';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller('chitietnhaphang')
export class ChitietnhaphangController {
  constructor(private readonly service: ChitietnhaphangService) {}

  // lấy chi tiết nhập hàng theo mã phiếu
  @Get('phieu/:MaPNH')
  async getByPhieu(@Param('MaPNH') MaPNH: string) {
    return this.service.findByPhieu(MaPNH);
  }
  // danh sách các CTSP sản phẩm
  @Get('variants')
  async getVariants() {
    return this.service.listVariants();
  }
  // tìm kiếm CTSP sản phẩm theo từ khóa
  @Get('variants/search')
  async searchVariants(@Query('q') q: string) {
    return this.service.searchVariants(q);
  }
  // lấy CTSP sản phẩm theo mã
  @Get('variants/:MaCTSP')
  async getVariantById(@Param('MaCTSP') MaCTSP: string) {
    return this.service.getVariant(MaCTSP);
  }


  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post('phieu/:MaPNH')
  async createForPhieu(
    @Param('MaPNH') MaPNH: string,
    @Body() items: CreateChiTietNhapHangDto[],
  ) {
    return this.service.createForPhieu(MaPNH, items as any);
  }
}
