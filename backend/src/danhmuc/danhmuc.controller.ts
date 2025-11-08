import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DanhMucService } from './danhmuc.service';
import { DanhMucDto } from './dto/danhmuc.dto';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { LoaiDanhMuc } from 'src/constant';
import type { Response } from 'express';
import { Roles } from 'src/factory_function/role';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@Controller('danhmuc')
export class DanhMucController {
  constructor(private readonly danhmucService: DanhMucService) {}

  // Xem thông tin danh mục (tất cả danh mục)
  @Get()
  @ResponseMessage('Lấy danh mục thành công')
  getAllDanhMuc() {
    return this.danhmucService.getAllDanhMuc();
  }
  // Xem thông tin danh mục theo id
  @Get(':id')
  @ResponseMessage('Lấy danh mục theo id thành công')
  getDanhMucById(@Param('id') id: string) {
    return this.danhmucService.getDanhMucById(id);
  }

  // Thêm mới danh mục sản phẩm
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post()
  @ResponseMessage('Thêm danh mục thành công')
  addDanhMuc(@Body() data: DanhMucDto) {
    return this.danhmucService.addDanhMuc(data);
  }

  // Cập nhật thông tin danh mục
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put('/update/:id')
  @ResponseMessage('Cập nhật danh mục thành công')
  updateDanhMuc(@Param('id') id: string, @Body() data: DanhMucDto) {
    return this.danhmucService.updateDanhMuc(id, data);
  }

  // Thay đổi trạng thái danh mục
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put(':id/trangthai')
  @ResponseMessage('Thay đổi trạng thái danh mục thành công')
  changeTrangThai(
    @Param('id') id: string,
    @Body('trangThai') trangThai: string,
  ) {
    return this.danhmucService.changeTrangThai(id, trangThai);
  }

  // Thay đổi loại danh mục
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put(':id/loai')
  @ResponseMessage('Thay đổi loại danh mục thành công')
  changeLoai(@Param('id') id: string, @Body('loai') loai: LoaiDanhMuc) {
    return this.danhmucService.changeLoai(id, loai);
  }

  // Xuất danh mục sản phẩm (ví dụ: export ra file, ở đây trả về danh sách)
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('export')
  @ResponseMessage('Xuất danh mục thành công')
  async exportDanhMucToExcel(@Res() res: Response) {
    try {
      const excelBuffer = await this.danhmucService.exportDanhMucToExcel();

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="danhmuc.xlsx"',
        'Content-Length': excelBuffer.length,
      });
      res.send(excelBuffer);
    } catch (error) {
      res
        .status(400)
        .json({ message: 'Xuất danh mục thất bại', error: error.message });
    }
  }
}
