import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePaymentDto } from 'src/thanhtoan/dto/thanhtoan.dto';

@Injectable()
export class ThanhtoanRepository {
  constructor(private readonly prismaService: PrismaService) {}
  // Các phương thức truy cập dữ liệu liên quan đến thanh toán sẽ được định nghĩa ở đây
  async findPaymentDetailById(MaDH: string) {
    return await this.prismaService.tHANHTOAN.findFirst({
      where: { MaDH },

      // Thêm các bảng liên quan khác nếu cần
    });
  }
  async findAllPayments() {
    return await this.prismaService.tHANHTOAN.findMany({});
  }
  async createPayment(data: CreatePaymentDto) {
    return await this.prismaService.tHANHTOAN.create({
      data: {
        SoTien: data.SoTien,
        PhuongThuc: data.PhuongThuc,
        MaDH: data.MaDH,
        MaKH: data.MaKH,
        MaGD: data.MaGD,
      },
      include: {
        DONHANG: true,
        TAIKHOAN: true,
      },
    });
  }
}
