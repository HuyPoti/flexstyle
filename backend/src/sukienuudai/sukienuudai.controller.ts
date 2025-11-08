import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { SuKienUuDaiService } from './sukienuudai.service';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { CreateSuKienUuDaiDto, SuKienUuDaiDto } from './dto/sukienuudai.dto';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { Roles } from 'src/factory_function/role';

@Controller('sukienuudai')
export class SuKienUuDaiController {
    constructor(readonly suKienUuDaiService: SuKienUuDaiService) {}
    @Get()
    @ResponseMessage('Lấy danh sách sự kiện ưu đãi thành công')
    getAll() {
        return this.suKienUuDaiService.getAll();
    }

    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @Get("/all")
    @ResponseMessage('Lấy danh sách sự kiện ưu đãi thành công')
    getAllByNV() {
        return this.suKienUuDaiService.getAll();
    }

    //lấy sự kiện ưu đãi theo id
    @Get('/:id')
    @ResponseMessage('Lấy sự kiện ưu đãi theo id thành công')
    getById(@Param('id') id: string) {
        return this.suKienUuDaiService.getById(id);
    }
    //thêm mới sự kiện ưu đãi
    @Post("/add")
    @ResponseMessage('Thêm mới sự kiện ưu đãi thành công')
    addSuKienUuDai(@Body() suKienUuDaiDto: CreateSuKienUuDaiDto) {
        return this.suKienUuDaiService.addSuKienUuDai(suKienUuDaiDto);
    }
    //chỉnh sửa sự kiện ưu đãi theo id
    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @Put('/update/:id')
    @ResponseMessage('Chỉnh sửa sự kiện ưu đãi thành công')
    updateSuKienUuDai(@Param('id') id: string, @Body() suKienUuDaiDto: SuKienUuDaiDto) {
        return this.suKienUuDaiService.updateSuKienUuDai(id, suKienUuDaiDto);
    }

    //thay đổi trạng thái sự kiện ưu đãi
    @Roles('NVVH')
    @UseGuards(JwtAuthGuard, TaiKhoanGuard)
    @Put(':id/trangthai')
    @ResponseMessage('Thay đổi trạng thái sự kiện ưu đãi thành công')
    changeStatus(@Param('id') id: string, @Body('trangThai') trangThai: string) {
        return this.suKienUuDaiService.changeStatus(id, trangThai);
    }
}
