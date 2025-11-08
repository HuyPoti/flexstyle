 
import { Controller, Get, Param, Put, Body, Post, UseGuards } from '@nestjs/common';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { PhieuNhapHangDto } from './dto/phieunhaphang.dto';
import { PhieuNhapHangService } from './phieunhaphang.service';
import { Roles } from 'src/factory_function/role';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { TrangThaiPhieuNhapHang } from '@prisma/client';

@Controller('phieunhaphang')
export class PhieuNhapHangController {
  constructor(private readonly phieuNhapHangService: PhieuNhapHangService) {}
  //lấy danh sách phiếu nhập hàng
  @Get()
  @ResponseMessage('Lấy danh sách phiếu nhập hàng thành công')
  getAll() {
    return this.phieuNhapHangService.findAll();
  }
  @Get('/ncc/:id')
  @ResponseMessage('Lấy phiếu nhập hàng theo id thành công')
  getByIdNcc(@Param('id') id: string) {
    return this.phieuNhapHangService.findByIdNcc(id);
  }
  //lấy phiếu nhập hàng theo id
  @Get(':id')
  @ResponseMessage('Lấy phiếu nhập hàng theo id thành công')
  getById(@Param('id') id: string) {
    return this.phieuNhapHangService.findById(id);
  }

   // Lấy danh sách phiếu nhập hàng có phân trang, lọc trạng thái và ngày
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('paged')
  @ResponseMessage('Lấy danh sách phiếu nhập hàng phân trang thành công')
  async getPaged(
    @Param('page') page?: string,
    @Param('pageSize') pageSize?: string,
    @Param('status') status?: TrangThaiPhieuNhapHang,
    @Param('date') date?: string,
  ) {
    // Lấy query từ request
    // Nếu dùng @Query thì cần import Query từ @nestjs/common
    // Sử dụng @Query thay vì @Param cho query string
    // Sửa lại cho đúng NestJS
    // ...existing code...
    return this.phieuNhapHangService.findPaged({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 10,
      status,
      date,
    });
  }

  //tạo phiếu nhập hàng
  @Roles('QLDN')
  @Post()
  @ResponseMessage('Tạo phiếu nhập hàng thành công')
  createPhieuNhapHang(@Body() data: PhieuNhapHangDto) {
    return this.phieuNhapHangService.create(data);
  }
  //chỉnh sửa phiêu nhập hàng
  @Put(':id')
  @ResponseMessage('Cập nhật phiếu nhập hàng thành công')
  updatePhieuNhapHang(@Param('id') id: string, @Body() data: PhieuNhapHangDto) {
    return this.phieuNhapHangService.update(id, data);
  }

  //Nhân viên xác nhận phiếu nhập hàng
  @Put(':id/nhanvienxacnhan')
  @Roles('QLDN')
  @ResponseMessage('Xác nhận phiếu nhập hàng thành công')
  nhanVienXacNhan(
    @Param('id') id: string,
    @Body('MaTKNVXN') MaTKNVXN: string,
    @Body('NoiDung') NoiDung: string,
  ) {
    return this.phieuNhapHangService.nhanVienXacNhan(id, MaTKNVXN, NoiDung);
  }

  //Nhà cung cấp xác nhận phiếu nhập hàng
  @Roles('NCC')
  @Put(':id/nhacungcapxacnhan')
  @ResponseMessage('Nhà cung cấp xác nhận phiếu nhập hàng thành công')
  nhaCungCapXacNhan(@Param('id') id: string, @Body('NoiDung') NoiDung: string) {
    return this.phieuNhapHangService.nhaCungCapXacNhan(id, NoiDung);
  }

  //Nhà cung cấp từ chối phiếu nhập hàng
  @Roles('NCC')
  @Put(':id/nhacungcaptuchoi')
  @ResponseMessage('Nhà cung cấp từ chối phiếu nhập hàng thành công')
  nhaCungCapTuChoi(@Param('id') id: string, @Body('NoiDung') NoiDung: string) {
    return this.phieuNhapHangService.nhaCungCapTuChoi(id, NoiDung);
  }
}
