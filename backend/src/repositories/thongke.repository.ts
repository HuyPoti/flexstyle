import { Injectable } from '@nestjs/common';
import { TrangThaiDonHang } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ThongkeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getDoanhThu() {
    // Lấy ngày đầu tiên của tháng 12 tháng trước
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1); // 12 tháng trước, tính cả tháng hiện tại
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Đầu tháng sau (không bao gồm)

    const result = await this.prisma.tINHTRANGDONHANG.findMany({
      where: {
        TrangThai: TrangThaiDonHang.DA_GIAO,
        created_at: {
          gte: start,
          lt: end,
        },
      },
      include: {
        DONHANG: {
          select: {
            MaDH: true,
            TongTien: true,
            SoLuong: true,
            created_at: true,
            VOUCHER: {
              select: {
                Loai: true,
                SoTien: true,
              },
            },
            SUKIENUUDAI:{
              select: {
                PhanTramGiam: true,
              }
            },
            CHITIETSANPHAM: {
              select: {
                SANPHAM: {
                  select: {
                    GiaMua: true,
                    GiaBan: true,
                    TenSP: true,
                    DANHMUC: {
                      select: {
                        TenDM: true
                      }
                    }
                  },
                },
              },
            },
          },
        },
      },
    });

    return result;
  }

  async getSLKhachHang() {
    // Lấy ngày đầu tiên của tháng 12 tháng trước
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const result = await this.prisma.tAIKHOAN.findMany({
      where: {
        created_at: {
          gte: start,
          lt: end,
        },
      },
      select: {
        created_at: true,
        MaTK: true,
      },
    });

    return result;
  }
}
