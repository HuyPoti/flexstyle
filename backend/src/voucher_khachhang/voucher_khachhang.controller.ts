import { Body, Controller, Get, Query, Res } from '@nestjs/common';
import { VoucherKhachHangService } from './voucher_khachhang.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Post } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
@Controller('voucher-khachhang')
export class VoucherKhachHangController {
  constructor(
    private readonly voucherKhachHangService: VoucherKhachHangService,
  ) {}
  //xem danh sách voucher khách hàng
  @Get()
  @ResponseMessage('Xem danh sách voucher khách hàng thành công')
  async findAll(@Query('MaAuth') MaAuth: string) {
    return this.voucherKhachHangService.findAll(MaAuth);
  }
  //xem chi tiết voucher khách hàng
  @Get(':id')
  @ResponseMessage('Xem chi tiết voucher khách hàng thành công')
  async findById(@Body() MaVCKH) {
    return this.voucherKhachHangService.findById(MaVCKH);
  }
  //thêm voucher khách hàng
  @Post('add')
  @ResponseMessage('Thêm voucher khách hàng thành công')
  async add(@Body() body: { MaKH: string; MaVoucher: string }) {
    const result = this.voucherKhachHangService.add(body.MaKH, body.MaVoucher);
    return result;
  }

  //kiểm tra voucher
  @Post('check')
  @ResponseMessage('Kiểm tra voucher thành công')
  async check(@Body() body: { MaVoucherKH: string; invoiceTotal: number }) {
    const result = this.voucherKhachHangService.check(body.MaVoucherKH, body.invoiceTotal);
    return result;
  }

  //thay đổi trang thái voucher khách hàng
  @Post('inactive-status')
  @ResponseMessage('Cập nhật trạng thái voucher khách hàng thành công')
  async inactiveStatus(@Body() body: { MaVC: string, MaTK: string}) {
    const result = this.voucherKhachHangService.inactiveStatus(body.MaVC, body.MaTK);
    return result;
  }
}
