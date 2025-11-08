import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ChitietnhaphangRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByMaPNH(MaPNH: string) {
    const items = await this.prisma.cHITIETNHAPHANG.findMany({ where: { MaPNH } });
    return items;
  }

  // Tạo chi tiết nhập hàng cho phiếu trong một transaction
  async createForPhieu(MaPNH: string, items: { MaCTSP: string; SoLuong?: number; DonGia?: number }[]) {
    const creations = items.map((it) =>
      this.prisma.cHITIETNHAPHANG.create({
        data: {
          MaPNH,
          MaCTSP: it.MaCTSP,
          SoLuong: it.SoLuong ?? 0,
          DonGia: it.DonGia ?? 0,
        } as any,
      }),
    );
    const result = await this.prisma.$transaction(creations);
    return result;
  }

  // danh sách các CTSP kèm tên sản phẩm và thuộc tính
  async listVariants() {
    const variants = await this.prisma.cHITIETSANPHAM.findMany({
      include: {
        SANPHAM: {
          select: { TenSP: true, GiaMua: true },
        },
      },
    });
    return variants.map((v) => ({
      MaCTSP: v.MaCTSP,
      MaSP: v.MaSP,
      TenSP: v.SANPHAM?.TenSP ?? '',
      KichCo: v.KichCo,
      SoLuong: v.SoLuong,
      GiaMua: v.SANPHAM?.GiaMua ?? 0,
    }));
  }

  // tìm kiếm các CTSP theo từ khóa
  async searchVariants(q: string) {
    if (!q || typeof q !== 'string') return [];
    const variants = await this.prisma.cHITIETSANPHAM.findMany({
      where: {
        SANPHAM: { TenSP: { contains: q, mode: 'insensitive' } },
      },
      include: { SANPHAM: { select: { TenSP: true, GiaMua: true } } },
      take: 30,
    });
    return variants.map((v) => ({
      MaCTSP: v.MaCTSP,
      MaSP: v.MaSP,
      TenSP: v.SANPHAM?.TenSP ?? '',
      KichCo: v.KichCo,
      SoLuong: v.SoLuong,
      GiaMua: v.SANPHAM?.GiaMua ?? 0,
    }));
  }

  async findVariantByMaCTSP(MaCTSP: string) {
    if (!MaCTSP) return null;
    const v = await this.prisma.cHITIETSANPHAM.findUnique({
      where: { MaCTSP },
      include: { SANPHAM: { select: { TenSP: true, GiaMua: true, MaSP: true, slug: true } } },
    });
    if (!v) return null;
    return {
      MaCTSP: v.MaCTSP,
      MaSP: v.MaSP,
      TenSP: v.SANPHAM?.TenSP ?? '',
      KichCo: v.KichCo,
      SoLuong: v.SoLuong,
      GiaMua: v.SANPHAM?.GiaMua ?? 0,
      slug: v.SANPHAM?.slug,
    };
  }
}
