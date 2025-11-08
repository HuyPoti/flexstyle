import { Controller, Get, Query, Body, Delete } from '@nestjs/common';
import { PhanHoiService } from './phanhoi.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { PhanHoiDto } from './dto/phanhoi.dto';
import { Roles } from 'src/factory_function/role';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common/decorators';
@Controller('phanhoi')
export class PhanHoiController {
  constructor(private readonly phanHoiService: PhanHoiService) {}
  @Get()
  @ResponseMessage('Lấy danh sách phản hồi theo sản phẩm thành công')
  async findAll(@Query() slug: string) {
    return await this.phanHoiService.findAll(slug);
  }
  //xem chi tiết phản hồi
  @Get('detail')
  @ResponseMessage('Lấy chi tiết phản hồi thành công')
  async findById(@Query() MaPH: string) {
    return await this.phanHoiService.findById(MaPH);
  }
  //chỉnh sửa phản hồi
  @Get('edit')
  @ResponseMessage('Chỉnh sửa phản hồi thành công')
  async update(
    @Query() MaPH: string,
    @Body() MaTKKH: string,
    @Body() updateData: PhanHoiDto,
  ) {
    return await this.phanHoiService.update(MaPH, MaTKKH, updateData);
  }
  //lấy phản hồi của khách hàng theo sản phẩm
  @Get('customer-feedback')
  @ResponseMessage('Lấy phản hồi của khách hàng theo sản phẩm thành công')
  async getCustomerFeedback(@Query() MaSP: string, @Query() MaTKKH: string) {
    return await this.phanHoiService.getCustomerFeedback(MaSP, MaTKKH);
  }
  //lấy phản hồi của khách hàng theo sản phẩm
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('/all/customer-feedback')
  @ResponseMessage('Lấy phản hồi của khách hàng theo sản phẩm thành công')
  async getCustomerFeedbackForNV() {
    const feedbacks = await this.phanHoiService.getCustomerFeedbackForNV();
    return feedbacks;
  }
  //xóa phản hồi
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Delete('delete')
  @ResponseMessage('Xóa phản hồi thành công')
  async delete(@Query('MaPH') MaPH: string) {
    return await this.phanHoiService.delete(MaPH);
  }
}
