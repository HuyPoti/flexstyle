import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import {
  CreateDonhangDto,
  CreateDonhangStatusDto,
} from 'src/donhang/dto/donhang.dto';

@Injectable()
export class DonhangRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Tạo đơn hàng mới
  async createOrder(data: CreateDonhangDto) {
    return await this.prisma.dONHANG.create({
      data: {
        MaDH: data.MaDH,
        SoLuong: data.SoLuong,
        TongTien: data.TongTien,
        TenNM: data.TenNM,
        SoDienThoai: data.SoDienThoai,  
        DiaChi: data.DiaChi,
        MaCTSP: data.MaCTSP,
        MaTK_KH: data.MaTK_KH,
        MaVoucher: data.MaVoucher,
        MaSK: data.MaSK,
        // Tạo trạng thái đơn hàng ban đầu
        TINHTRANGDONHANG: {
          create: {
            TrangThai: 'CHUA_GIAO',
          },
        },
      },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
        VOUCHER: true,
        SUKIENUUDAI: true,
        KHACHHANG_ACCOUNT: true,
        TINHTRANGDONHANG: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
  }

  // Tìm đơn hàng theo ID
  async findOrderById(MaDH: string) {
    return await this.prisma.dONHANG.findUnique({
      where: { MaDH },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
        VOUCHER: true,
        SUKIENUUDAI: true,
        KHACHHANG_ACCOUNT: {
          select: {
            MaTK: true,
            Username: true,
            Avatar: true,
          },
        },
        TINHTRANGDONHANG: {
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
  }

  async findAllOrdersForCustomer(filters?: {
    MaTK_KH?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.DONHANGWhereInput = {};

    if (filters?.MaTK_KH) {
      where.MaTK_KH = filters.MaTK_KH;
    }

    const [orders, total] = await Promise.all([
      this.prisma.dONHANG.findMany({
        where,
        skip: filters?.skip || 0,
        take: filters?.take || 50,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          CHITIETSANPHAM: {
            include: {
              SANPHAM: true,
            },
          },
          TINHTRANGDONHANG: {
            orderBy: {
              created_at: 'desc',
            },
            take: 1, // Chỉ lấy trạng thái mới nhất cho danh sách
          },
        },
      }),
      this.prisma.dONHANG.count({ where }),
    ]);

    return { orders, total };
  }

  // Lấy tất cả đơn hàng của khách hàng đó <nhân viên chăm sóc khách hàng> (có thể lọc theo khách hàng)
  async findAllOrdersForStaff(filters?: { skip?: number; take?: number }) {
    const where: Prisma.DONHANGWhereInput = {};

    const [orders] = await Promise.all([
      this.prisma.dONHANG.findMany({
        where,
        skip: filters?.skip || 0,
        take: filters?.take || 50,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          CHITIETSANPHAM: {
            include: {
              SANPHAM: true,
            },
          },
          TINHTRANGDONHANG: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      }),
    ]);

    return orders;
  }

  // Cập nhật trạng thái đơn hàng
  async updateOrderStatus(MaDH: string, TrangThai: string) {
    // Tạo bản ghi trạng thái mới
    await this.prisma.tINHTRANGDONHANG.create({
      data: {
        TrangThai: TrangThai as any,
        MaDH,
      },
    });

    // Trả về đơn hàng với trạng thái mới nhất
    return await this.findOrderById(MaDH);
  }

  // Xóa đơn hàng (soft delete - cập nhật trạng thái thành HUY)
  async cancelOrder(MaDH: string) {
    return await this.updateOrderStatus(MaDH, 'HUY');
  }

  // Xóa đơn hàng hoàn toàn (hard delete)
  async deleteOrder(MaDH: string) {
    // Xóa tình trạng đơn hàng trước
    await this.prisma.tINHTRANGDONHANG.deleteMany({
      where: { MaDH },
    });

    // Xóa đơn hàng
    return await this.prisma.dONHANG.delete({
      where: { MaDH },
    });
  }

  // Lấy chi tiết sản phẩm để tính giá
  async getProductDetail(MaCTSP: string) {
    return await this.prisma.cHITIETSANPHAM.findUnique({
      where: { MaCTSP },
      // include: {
      //   SANPHAM: true,
      // },
    });
  }

  // Lấy thông tin voucher
  // async getVoucher(MaVoucher: string) {
  //   return await this.prisma.vOUCHER.findUnique({
  //     where: { MaVoucher },
  //   });
  // }

  // // Lấy thông tin sự kiện ưu đãi
  // async getPromotion(MaSK: string) {
  //   return await this.prisma.sUKIENUUDAI.findUnique({
  //     where: { MaSK },
  //   });
  // }

  // Cập nhật số lượng sản phẩm trong kho
  async updateProductStock(MaCTSP: string, quantity: number) {
    const currentProduct = await this.prisma.cHITIETSANPHAM.findUnique({
      where: { MaCTSP },
    });

    if (!currentProduct) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    const newQuantity = currentProduct.SoLuong - quantity;

    return await this.prisma.cHITIETSANPHAM.update({
      where: { MaCTSP },
      data: {
        SoLuong: newQuantity,
        TrangThaiSP: newQuantity <= 0 ? 'HET_HANG' : currentProduct.TrangThaiSP,
      },
    });
  }

  // Khôi phục số lượng sản phẩm khi hủy đơn
  async restoreProductStock(MaCTSP: string, quantity: number) {
    const currentProduct = await this.prisma.cHITIETSANPHAM.findUnique({
      where: { MaCTSP },
    });

    if (!currentProduct) {
      throw new Error('Không tìm thấy sản phẩm');
    }

    const newQuantity = currentProduct.SoLuong + quantity;

    return await this.prisma.cHITIETSANPHAM.update({
      where: { MaCTSP },
      data: {
        SoLuong: newQuantity,
        TrangThaiSP: newQuantity > 0 ? 'CON_HANG' : currentProduct.TrangThaiSP,
      },
    });
  }

  // Lấy tổng hợp đơn hàng theo trạng thái
  async getOrderSummary(MaTK_KH?: string) {
    const where: Prisma.DONHANGWhereInput = {};

    if (MaTK_KH) {
      where.MaTK_KH = MaTK_KH;
    }

    const [
      totalOrders,
      processingOrders,
      shippingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
    ] = await Promise.all([
      // Tổng số đơn hàng
      this.prisma.dONHANG.count({ where }),

      // Đơn hàng chưa giao
      this.prisma.dONHANG.count({
        where: {
          ...where,
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
          ...where,
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
          ...where,
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
          ...where,
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'HUY',
            },
          },
        },
      }),

      // Tổng doanh thu (chỉ tính đơn đã giao)
      this.prisma.dONHANG.aggregate({
        where: {
          ...where,
          TINHTRANGDONHANG: {
            some: {
              TrangThai: 'DA_GIAO' as any,
            },
          },
        },
        _sum: {
          TongTien: true,
        },
      }),
    ]);

    return {
      totalOrders,
      processingOrders, // CHUA_GIAO
      shippingOrders, // DANG_GIAO
      completedOrders, // DA_GIAO
      cancelledOrders, // HUY
      totalRevenue: totalRevenue._sum.TongTien || 0,
    };
  }

  async addOrderStatus(body: CreateDonhangStatusDto) {
    // Thêm trạng thái mới
    const newStatus = await this.prisma.tINHTRANGDONHANG.create({
      data: {
        MaDH: body.MaDH,
        TrangThai: body.TrangThai,
      },
    });

    return newStatus;
  }
}
