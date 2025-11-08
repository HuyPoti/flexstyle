import { Injectable } from '@nestjs/common';
import { Prisma, TrangThai } from '@prisma/client';
import { LoaiTB } from 'src/constant';
import { PrismaService } from 'src/prisma.service';
import { ThongBaoDto } from 'src/thongbao/dto/thongbao.dto';

@Injectable()
export class ThongbaoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllSK() {
    return this.prisma.tHONGBAO.findMany({
      where: {
        Loai: LoaiTB.SUKIENUUDAI,
      },
    });
  }

  async findAllVC() {
    return this.prisma.tHONGBAO.findMany({
      where: {
        Loai: LoaiTB.VOUCHER,
      },
    });
  }

  async findSK_MaSK(MaSK: string) {
    return this.prisma.tHONGBAO.findFirst({
      where: { Loai: LoaiTB.SUKIENUUDAI, MaSK: MaSK },
    });
  }

  async findVC_MaVoucher(MaVoucher: string) {
    return this.prisma.tHONGBAO.findFirst({
      where: { Loai: LoaiTB.VOUCHER, MaVoucher: MaVoucher },
    });
  }

async createThongBao(Loai: LoaiTB, MaSK?: string, MaVoucher?: string  ) {
  return this.prisma.tHONGBAO.create({
    data: {
      Loai: Loai,
      ...(MaVoucher !== undefined ? { MaVoucher } : {}),
      ...(MaSK !== undefined ? { MaSK } : {}),
    }
  });
}

  async deleteByLoai(Loai: LoaiTB) {
    return this.prisma.tHONGBAO.deleteMany({
      where: { Loai },
    });
  }
  async deleteById(MaTB: string) {
    return this.prisma.tHONGBAO.delete({
      where: { MaTB },
    });
  }
}
