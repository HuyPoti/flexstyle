import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ThanhtoanService } from './thanhtoan.service';
import { CreatePaymentDto } from './dto/thanhtoan.dto';
import { ResponseMessage } from 'src/decorators/response.decorator';

@Controller('thanhtoan')
export class ThanhtoanController {
    constructor(private readonly thanhtoanService: ThanhtoanService) {}
    //tạo thanh toán
    @Post("/create")
    @ResponseMessage('Tạo thanh toán thành công')
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.thanhtoanService.createPayment(createPaymentDto);
    }
    //lấy danh sách thanh toán
    @Get()
    @ResponseMessage('Lấy danh sách thanh toán thành công')
    async getPaymentList() {
        return this.thanhtoanService.getPaymentList();
    }

    //lấy thanh toán theo id
    @Get(':id')
    @ResponseMessage('Lấy thanh toán theo id thành công')
    async getPaymentById(@Param('id') id: string) {
        return this.thanhtoanService.getPaymentById(id);
    }
}
