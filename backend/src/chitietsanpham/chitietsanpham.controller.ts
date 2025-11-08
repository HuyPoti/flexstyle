import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { ChitietsanphamService } from './chitietsanpham.service';
import { ChiTietSanPhamDto } from './dto/chitietsanpham.dto';
@Controller('chitietsanpham')
export class ChitietsanphamController {
  constructor(private readonly chitietsanphamService: ChitietsanphamService) {}

  // Lay tat ca chi tiet san pham
  @Get()
  async findAll(@Query('take') take?: string, @Query('skip') skip?: string) {
    return this.chitietsanphamService.chitietsanphams({
      take: take ? Number(take) : undefined,
      skip: skip ? Number(skip) : undefined,
    });
  }

  // Lay chi tiet san pham theo ID

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.chitietsanphamService.chitietsanpham({ MaCTSP: id });
  }

  // Tao chi tiet san pham
  @Post()
  async create(@Body() data: ChiTietSanPhamDto) {
    return this.chitietsanphamService.createChitietsanpham(data);
  }

  // Xoa chi tiet san pham
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.chitietsanphamService.deleteChitietsanpham({ MaCTSP: id });
  }

  // Cap nhat chi tiet san pham
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: ChiTietSanPhamDto) {
    return this.chitietsanphamService.updateChitietsanpham({
      where: { MaCTSP: id },
      data,
    });
  }

  // Tang so luong chi tiet san pham
  @Put(':id/tangsoluong')
  async tangSoLuong(
    @Param('id') id: string,
    @Body('tangSoLuong') tangSoLuong: number,
  ) {
    return this.chitietsanphamService.tangSoLuongChitietsanpham(
      { MaCTSP: id },
      tangSoLuong,
    );
  }

  // Giam so luong chi tiet san pham
  @Put(':id/giamsoluong')
  async giamSoLuong(
    @Param('id') id: string,
    @Body('giamSoLuong') giamSoLuong: number,
  ) {
    return this.chitietsanphamService.giamSoLuongChitietsanpham(
      { MaCTSP: id },
      giamSoLuong,
    );
  }
}
