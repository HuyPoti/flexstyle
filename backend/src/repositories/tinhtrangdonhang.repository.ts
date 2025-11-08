import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, TrangThaiDonHang } from '@prisma/client';

@Injectable()
export class TinhtrangDonhangRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo tình trạng đơn hàng mới
  async createOrderStatus(data: {
    MaDH: string;
    TrangThai: string;
  }) {
    return await this.prisma.tINHTRANGDONHANG.create({
      data: {
        MaDH: data.MaDH,
        TrangThai: data.TrangThai as any,
      },
      include: {
        DONHANG: {
          include: {
            KHACHHANG_ACCOUNT: {
              select: {
                MaTK: true,
                Username: true,
              },
            },
          },
        },
      },
    });
  }

  // Tìm tình trạng đơn hàng theo ID
  async findOrderStatusById(MaTTDH: string) {
    return await this.prisma.tINHTRANGDONHANG.findUnique({
      where: { MaTTDH },
      include: {
        DONHANG: {
          include: {
            KHACHHANG_ACCOUNT: {
              select: {
                MaTK: true,
                Username: true,
              },
            },
          },
        },
      },
    });
  }

  // Lấy tất cả tình trạng đơn hàng (có lọc)
  async findAllOrderStatuses(filters?: {
    MaDH?: string;
    TrangThai?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.TINHTRANGDONHANGWhereInput = {};

    if (filters?.MaDH) {
      where.MaDH = filters.MaDH;
    }

    if (filters?.TrangThai) {
      where.TrangThai = filters.TrangThai as any;
    }

    const [statuses, total] = await Promise.all([
      this.prisma.tINHTRANGDONHANG.findMany({
        where,
        skip: filters?.skip || 0,
        take: filters?.take || 50,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          DONHANG: {
            include: {
              KHACHHANG_ACCOUNT: {
                select: {
                  MaTK: true,
                  Username: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.tINHTRANGDONHANG.count({ where }),
    ]);

    return { statuses, total };
  }

  // Lấy lịch sử trạng thái của một đơn hàng
  async getOrderStatusHistory(MaDH: string) {
    return await this.prisma.tINHTRANGDONHANG.findMany({
      where: { MaDH },
      orderBy: {
        created_at: 'asc',
      },
      include: {
        DONHANG: {
          select: {
            MaDH: true,
            TongTien: true,
            created_at: true,
          },
        },
      },
    });
  }

  // Lấy trạng thái hiện tại của đơn hàng
  async getCurrentOrderStatus(MaDH: string) {
    return await this.prisma.tINHTRANGDONHANG.findFirst({
      where: { MaDH },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        DONHANG: true,
      },
    });
  }

  // Cập nhật tình trạng đơn hàng (thực chất là tạo mới)
  async updateOrderStatus(MaDH: string, TrangThai: string) {
    return await this.createOrderStatus({ MaDH, TrangThai });
  }

  // Xóa tình trạng đơn hàng
  async deleteOrderStatus(MaTTDH: string) {
    return await this.prisma.tINHTRANGDONHANG.delete({
      where: { MaTTDH },
    });
  }

  // Xóa tất cả tình trạng của một đơn hàng
  async deleteAllOrderStatuses(MaDH: string) {
    return await this.prisma.tINHTRANGDONHANG.deleteMany({
      where: { MaDH },
    });
  }

  // Lấy thống kê trạng thái đơn hàng
  async getOrderStatusStatistics() {
    const [
      total,
      chuaGiao,
      dangGiao,
      daGiao,
      huy,
      loi,
      xacNhanLoi,
    ] = await Promise.all([
      // Tổng số đơn hàng (đếm distinct MaDH)
      this.prisma.dONHANG.count(),
      
      // Đơn hàng chưa giao
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'CHUA_GIAO' as any,
            },
          },
        },
      }),
      
      // Đơn hàng đang giao
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'DANG_GIAO' as any,
            },
          },
        },
      }),
      
      // Đơn hàng đã giao
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'DA_GIAO' as any,
            },
          },
        },
      }),
      
      // Đơn hàng đã hủy
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'HUY' as any,
            },
          },
        },
      }),
      
      // Đơn hàng lỗi
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'LOI' as any,
            },
          },
        },
      }),
      
      // Đơn hàng xác nhận lỗi
      this.prisma.dONHANG.count({
        where: {
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'XAC_NHAN_LOI' as any,
            },
          },
        },
      }),
    ]);

    return {
      total,
      chuaGiao,
      dangGiao,
      daGiao,
      huy,
      loi,
      xacNhanLoi,
    };
  }

  // Kiểm tra đơn hàng tồn tại
  async orderExists(MaDH: string): Promise<boolean> {
    const count = await this.prisma.dONHANG.count({
      where: { MaDH },
    });
    return count > 0;
  }

  // Lấy thông tin đơn hàng
  async getOrder(MaDH: string) {
    return await this.prisma.dONHANG.findUnique({
      where: { MaDH },
      include: {
        KHACHHANG_ACCOUNT: {
          select: {
            MaTK: true,
            Username: true,
          },
        },
        TINHTRANGDONHANG: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
        },
      },
    });
  }
}
