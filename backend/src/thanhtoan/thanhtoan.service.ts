import { BadRequestException, Injectable } from '@nestjs/common';
import { ThanhtoanRepository } from 'src/repositories/thanhtoan.repository';
import { CreatePaymentDto } from './dto/thanhtoan.dto';
import { DonhangRepository } from 'src/repositories/donhang.repository';

@Injectable()
export class ThanhtoanService {
    constructor(private readonly thanhtoanRepository: ThanhtoanRepository,
        private readonly donHangRepository: DonhangRepository
    ) {}
    //tạo thanh toán
    async createPayment(createPaymentDto: CreatePaymentDto) {
        const donhang = await this.donHangRepository.findOrderById(createPaymentDto.MaDH);
        if (!donhang) {
            throw new BadRequestException('Đơn hàng không tồn tại');
        }
        return this.thanhtoanRepository.createPayment(createPaymentDto);
    }
    //lấy danh sách thanh toán
    async getPaymentList() {
        return this.thanhtoanRepository.findAllPayments();
    }
    //lấy thanh toán theo id
    async getPaymentById(id: string) {
        return this.thanhtoanRepository.findPaymentDetailById(id);
    }
}
