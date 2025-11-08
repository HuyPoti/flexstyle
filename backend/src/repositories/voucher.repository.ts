import { Injectable } from '@nestjs/common';
import { TrangThai } from 'src/constant';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class VoucherRepository {
  constructor(private readonly prismaService: PrismaService) {}
  //lấy tất cả voucher
  async getAllVouchers() {
    return this.prismaService.vOUCHER.findMany();
  }
  //lấy voucher theo id
  async getVoucherById(id: string) {
    return this.prismaService.vOUCHER.findUnique({
      where: { MaVoucher: id },
    });
  }

  //lấy voucher theo code
  async getVoucherByCode(code: string) {
    return this.prismaService.vOUCHER.findFirst({
      where: { Code: code },
    });
  }

  //lấy voucher theo tên
  async getVoucherByName(name: string) {
    return this.prismaService.vOUCHER.findFirst({
      where: { TenVoucher: name },
    });
  }
  //thêm mới voucher
  async addVoucher(newdata: any) {
    return this.prismaService.vOUCHER.create({
      data: newdata,
    });
  }
  //chỉnh sửa voucher dựa trên id là chuỗi
  async updateVoucher(MaVoucher: string, updatedata: any) {
    return this.prismaService.vOUCHER.update({
      where: { MaVoucher },
      data: updatedata,
    });
  }
  //thay đổi trạng thái biết trạng thái là kiểu enum
  async changeStatus(MaVoucher: string, TrangThai: TrangThai) {
    return this.prismaService.vOUCHER.update({
      where: { MaVoucher },
      data: {
        TrangThai,
      },
    });
  }
  //kiểm tra mã voucher
  async checkVoucherCode(code: string) {
    return this.prismaService.vOUCHER.findFirst({
      where: { Code: code },
    });
  }
}
