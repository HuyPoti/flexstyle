import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoaiDanhMuc, Prisma } from '@prisma/client';
import { SanPhamDto } from './dto/sanpham.dto';

export interface SANPHAM {
  MaSP: string;
  created_at: Date;
  updated_at: Date;
  MoTa: string | null;
  TenSP: string;
  HinhAnh: string[];
  GiaBan: number;
  GiaMua: number;
  TrangThai: 'ACTIVE' | 'INACTIVE';
  MaDM: string;
  MauSac: string;
  slug: string;
}

@Injectable()
export class SanphamService {
  constructor(private prisma: PrismaService) {}

  // Lay san pham theo ID
  async sanpham(slug: string): Promise<SANPHAM | null> {
    return this.prisma.sANPHAM.findFirst({
      where: { slug: slug },
      include: {
        CHITIETSANPHAM: {
          select: { MaCTSP: true, SoLuong: true, KichCo: true },
        },
      },
    });
  }

  // Lấy danh sách sản phẩm
  async sanphams(params: {
    skip?: number;
    take?: number;
    includeSizes?: boolean;
    includeTenDM?: string;
    loaiDM?: string;
    // cursor?: { MaSP: string };
    // where?: any;
    // orderBy?: any;
  }): Promise<SANPHAM[]> {
    const {
      skip = 0,
      take = 50,
      includeSizes = false,
      includeTenDM = '',
      loaiDM = '',
    } = params;
    const tenCacDM = includeTenDM
      ? decodeURIComponent(includeTenDM)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    const whereClause: any = {};
    if (tenCacDM.length > 0) {
      whereClause.DANHMUC = {
        TenDM: { in: tenCacDM },
        LoaiDanhMuc: loaiDM ? (loaiDM as LoaiDanhMuc) : undefined,
      };
    }

    const items = await this.prisma.sANPHAM.findMany({
      skip,
      take,
      where: Object.keys(whereClause).length ? whereClause : undefined,
      include: includeSizes
        ? {
            CHITIETSANPHAM: {
              select: { MaCTSP: true, SoLuong: true, KichCo: true },
            },
            DANHMUC: {
              select: { MaDM: true, TenDM: true, Loai: true },
            },
          }
        : undefined,
    });

    return items;
  }
  async findRelated(tenSP: string): Promise<SANPHAM[]> {
    const product = await this.prisma.sANPHAM.findFirst({
      where: { TenSP: tenSP },
    });
    const relatedProducts = await this.prisma.sANPHAM.findMany({
      take: 10,
      where: {
        MaDM: product?.MaDM,
      },
      include: {
        CHITIETSANPHAM: {
          select: { MaCTSP: true, SoLuong: true },
        },
      },
    });
    return relatedProducts;
  }
  // Tao san pham moi
  async createSanpham(data: SanPhamDto): Promise<SANPHAM> {
    const payload: Prisma.SANPHAMCreateInput = {
      TenSP: data.TenSP,
      MoTa: data.MoTa,
      HinhAnh: data.HinhAnh,
      GiaBan: data.GiaBan,
      GiaMua: data.GiaMua,
      TrangThai: 'ACTIVE',
      MauSac: data.MauSac,
      DANHMUC: {
        connect: { MaDM: data.MaDM },
      },
      slug: data.slug,
    };

    return this.prisma.sANPHAM.create({ data: payload });
  }

  // Cập nhật sản phẩm
  async updateSanPham(params: {
    where: { MaSP: string };
    data: SanPhamDto;
  }): Promise<SANPHAM> {
    const { where, data } = params;

    const payload: Prisma.SANPHAMUpdateInput = {
      TenSP: data.TenSP,
      MoTa: data.MoTa,
      HinhAnh: data.HinhAnh,
      GiaBan: data.GiaBan,
      MauSac: data.MauSac,
      DANHMUC: {
        connect: { MaDM: data.MaDM },
      },
      slug: data.slug,
    };

    try {
      return await this.prisma.sANPHAM.update({
        data: payload,
        where,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }
      throw error;
    }
  }

  // 🔹 Service riêng để cập nhật trạng thái sản phẩm
  async updateTrangThaiSanPham(
    MaSP: string,
    trangThai: 'ACTIVE' | 'INACTIVE',
  ): Promise<SANPHAM> {
    try {
      return await this.prisma.sANPHAM.update({
        where: { MaSP },
        data: { TrangThai: trangThai },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Sản phẩm không tồn tại');
      }
      throw error;
    }
  }
}
