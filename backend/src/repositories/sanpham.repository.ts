import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class SanPhamRepository {
  constructor(private readonly prisma: PrismaService) {}
  //lấy sản phẩm theo mã sản phẩm
  async findSPByID(MaSP: string) {
    return await this.prisma.sANPHAM.findUnique({
      where: { MaSP },
    });
  }
  async findSPBySlug(slug: string) {
    return await this.prisma.sANPHAM.findFirst({
      where: { slug: { equals: slug['slug'] } },
    });
  }
}
