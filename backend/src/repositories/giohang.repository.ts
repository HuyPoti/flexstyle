import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class GiohangRepository {
  constructor(private readonly prisma: PrismaService) {}
  //tạo giỏ hàng
  // Tìm giỏ hàng theo MaTKKH
  async findCartByUserId(MaTKKH: string) {
    return await this.prisma.gIOHANG.findFirst({
      where: { MaTKKH },
      include: {
        CHITIETGIOHANG: {
          include: {
            CHITIETSANPHAM: {
              include: {
                SANPHAM: true,
              },
            },
          },
        },
      },
    });
  }

  // Tìm giỏ hàng theo MaGH
  async findCartById(MaGH: string) {
    return await this.prisma.gIOHANG.findUnique({
      where: { MaGH },
      include: {
        CHITIETGIOHANG: {
          include: {
            CHITIETSANPHAM: {
              include: {
                SANPHAM: true,
              },
            },
          },
        },
      },
    });
  }

  // Tạo giỏ hàng mới
  async createCart(data: { MaTKKH: string }) {
    return await this.prisma.gIOHANG.create({
      data,
      include: {
        CHITIETGIOHANG: {
          include: {
            CHITIETSANPHAM: {
              include: {
                SANPHAM: true,
              },
            },
          },
        },
      },
    });
  }

  // Xóa giỏ hàng
  // async deleteCart(MaGH: string) {
  //   return await this.prisma.gIOHANG.delete({
  //     where: { MaGH },
  //   });
  // }

  // Tìm chi tiết giỏ hàng theo MaCTGH
  async findCartItemById(MaCTGH: string) {
    return await this.prisma.cHITIETGIOHANG.findUnique({
      where: { MaCTGH },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
        GIOHANG: true,
      },
    });
  }

  // Tìm chi tiết giỏ hàng theo MaGH và MaCTSP
  async findCartItemByProductDetail(MaGH: string, MaCTSP: string) {
    return await this.prisma.cHITIETGIOHANG.findFirst({
      where: {
        MaGH,
        MaCTSP,
      },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });
  }

  // Lấy tất cả sản phẩm trong giỏ hàng
  async findAllCartItems(MaGH: string) {
    return await this.prisma.cHITIETGIOHANG.findMany({
      where: { MaGH },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // Thêm sản phẩm vào giỏ hàng
  async createCartItem(data: { MaGH: string; MaCTSP: string; SoLuong: number }) {
    return await this.prisma.cHITIETGIOHANG.create({
      data,
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });
  }

  // Cập nhật số lượng sản phẩm trong giỏ
  async updateCartItemQuantity(MaCTGH: string, SoLuong: number) {
    return await this.prisma.cHITIETGIOHANG.update({
      where: { MaCTGH },
      data: { SoLuong },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });
  }

  // Xóa sản phẩm khỏi giỏ hàng
  async deleteCartItem(MaCTGH: string) {
    return await this.prisma.cHITIETGIOHANG.delete({
      where: { MaCTGH },
    });
  }

  // Xóa tất cả sản phẩm trong giỏ hàng
  async deleteAllCartItems(MaGH: string) {
    return await this.prisma.cHITIETGIOHANG.deleteMany({
      where: { MaGH },
    });
  }

  // Đếm số lượng sản phẩm trong giỏ
  async countCartItems(MaGH: string) {
    return await this.prisma.cHITIETGIOHANG.count({
      where: { MaGH },
    });
  }

  // Tính tổng giá trị giỏ hàng
  async calculateCartTotal(MaGH: string) {
    const items = await this.prisma.cHITIETGIOHANG.findMany({
      where: { MaGH },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });

    return items.reduce(
      (acc, item) => {
        return {
          totalQuantity: acc.totalQuantity + item.SoLuong,
          totalValue:
            acc.totalValue +
            item.SoLuong * Number(item.CHITIETSANPHAM.SANPHAM.GiaBan),
        };
      },
      { totalQuantity: 0, totalValue: 0 },
    );
  }

  // Kiểm tra tồn kho trước khi checkout
  async validateStockForCheckout(MaGH: string) {
    const items = await this.prisma.cHITIETGIOHANG.findMany({
      where: { MaGH },
      include: {
        CHITIETSANPHAM: {
          include: {
            SANPHAM: true,
          },
        },
      },
    });

    const outOfStockItems = items.filter(
      (item) => item.CHITIETSANPHAM.SoLuong < item.SoLuong,
    );

    return {
      isValid: outOfStockItems.length === 0,
      outOfStockItems: outOfStockItems.map((item) => ({
        MaCTGH: item.MaCTGH,
        TenSP: item.CHITIETSANPHAM.SANPHAM.TenSP,
        requestedQuantity: item.SoLuong,
        availableQuantity: item.CHITIETSANPHAM.SoLuong,
      })),
    };
  }
}
