import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class PhanHoiRepository {
  constructor(private readonly prisma: PrismaService) {}
  //lấy danh sách phản hồi theo sản phẩm
  async findAll(MaSP: string) {
    return await this.prisma.pHANHOI.findMany({
      where: { MaSP },
      orderBy: { created_at: 'desc' },
    });
  }
  async findAllCustomer(MaTKKH: string[]) {
    const feedbacksCustomer = await this.prisma.tAIKHOAN.findMany({
      where: { MaTK: { in: MaTKKH } },
      orderBy: { created_at: 'desc' },
    });
    return feedbacksCustomer.map((fb) => fb.Username);
  }
  //xem chi tiết phản hồi
  async findById(MaPH: string) {
    return await this.prisma.pHANHOI.findUnique({
      where: { MaPH: MaPH },
    });
  }
  //chỉnh sửa phản hồi
  async update(MaPH: string, MaTKKH: string, updateData: any) {
    return await this.prisma.pHANHOI.updateMany({
      where: { MaPH, MaTKKH },
      data: {
        ...updateData,
        updated_at: new Date(),
      },
    });
  }
  //lấy phản hồi của khách hàng theo sản phẩm
  async getCustomerFeedback(MaSP: string, MaTKKH: string) {
    return await this.prisma.pHANHOI.findFirst({
      where: { MaSP, MaTKKH },
      orderBy: { created_at: 'desc' },
    });
  }
  //xóa phản hồi
  async delete(MaPH: string) {
    return await this.prisma.pHANHOI.delete({
      where: { MaPH },
    });
  }

  //lấy phản hồi của khách hàng theo sản phẩm cho nhân viên
  async getCustomerFeedbackForNV() {
    return await this.prisma.pHANHOI.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        SANPHAM: {
          select: {
            TenSP: true,
          },
        },
        TAIKHOAN: {
          select: {
            Username: true,
          },
        },
      },
    });
  }
}
