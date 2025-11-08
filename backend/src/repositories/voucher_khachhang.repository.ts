import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TrangThai } from 'src/constant';
@Injectable()
export class VoucherKhachHangRepository {
  constructor(private readonly prisma: PrismaService) {}
  //sử dụng voucher cho khách hàng
  async useVoucher(MaKH: string, MaVCKH: string) {
    return await this.prisma.vOUCHER_KHACHHANG.update({
      where: { MaVCKH },
      data: {
        TrangThai: TrangThai.INACTIVE,
        updated_at: new Date(),
      },
    });
  }
  //xem danh sách voucher của khách hàng
  async findAll(MaTKKH: string) {
    const user = await this.prisma.tAIKHOAN.findFirst({
      where: { MaTK: MaTKKH },
    });
    return await this.prisma.vOUCHER_KHACHHANG.findMany({
      where: { MaTKKH: user?.MaTK },
      //orderBy: { created_at: 'desc' },
    });
  }
  //xem chi tiết voucher khách hàng
  async findById(MaVCKH: string) {
    return await this.prisma.vOUCHER_KHACHHANG.findUnique({
      where: { MaVCKH },
    });
  }
  async findByVoucherAndUser(MaVC: string, MaTK: string) {
    return await this.prisma.vOUCHER_KHACHHANG.findFirst({
      where: { MaVoucher: MaVC, MaTKKH: MaTK },
    });
  }
  //thêm voucher khách hàng
  async add(MaTKKH: string, MaVoucher: string) {
    return await this.prisma.vOUCHER_KHACHHANG.create({
      data: {
        MaTKKH,
        MaVoucher,
        TrangThai: TrangThai.ACTIVE,
        created_at: new Date(),
        updated_at: new Date(),
        Hsd: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Hạn sử dụng 1 tháng từ ngày tạo
      },
    });
  }

  //tìm kiếm voucher đã được thêm cho khách hàng
  async findVoucherForCustomer(MaTKKH: string, MaVoucher: string) {
    return await this.prisma.vOUCHER_KHACHHANG.findFirst({
      where: { MaTKKH, MaVoucher },
    });
  }

  //cập nhật trạng thái voucher khách hàng
  async updateVoucherStatus(MaVoucher: string, status: TrangThai) {
    return await this.prisma.vOUCHER_KHACHHANG.updateMany({
      where: { MaVoucher },
      data: {
        TrangThai: status,
        updated_at: new Date(),
      },
    });
  }
  async inactiveVoucherStatus(MaVCKH: string) {
    return await this.prisma.vOUCHER_KHACHHANG.update({
      where: { MaVCKH },
      data: {
        TrangThai: TrangThai.INACTIVE,
        updated_at: new Date(),
      },
    });
  }
}
