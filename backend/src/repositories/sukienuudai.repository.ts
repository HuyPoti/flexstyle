import { Injectable } from '@nestjs/common';
import { Prisma, TrangThai } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { SuKienUuDaiMapper } from 'src/sukienuudai/entity/sukienuudai.mapper';

@Injectable()
export class SuKienUuDaiRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const suKienUuDai = await this.prisma.sUKIENUUDAI.findMany();
    return suKienUuDai ? SuKienUuDaiMapper.toEntityList(suKienUuDai) : null;
  }

  async findByName(name: string) {
    return await this.prisma.sUKIENUUDAI.findFirst({
      where: { TenSK: name },
    });
  }

  async add(data: any) {
    const suKienUuDai = await this.prisma.sUKIENUUDAI.create({
      data: data,
    });
    return SuKienUuDaiMapper.toEntity(suKienUuDai);
  }

  async findById(id: string) {
    const suKienUuDai = await this.prisma.sUKIENUUDAI.findUnique({
      where: { MaSK: id },
    });
    return suKienUuDai ? SuKienUuDaiMapper.toEntity(suKienUuDai) : null;
  }

  async update(id: string, data: any) {
    const suKienUuDai = await this.prisma.sUKIENUUDAI.update({
      where: { MaSK: id },
      data: data,
    });
    return suKienUuDai ? SuKienUuDaiMapper.toEntity(suKienUuDai) : null;
  }

  async changeTrangThai(MaSK: string, TrangThai: TrangThai) {
    const suKienUuDai = await this.prisma.sUKIENUUDAI.update({
      where: { MaSK },
      data: {
        TrangThai,
        updated_at: new Date(),
      },
    });
    return SuKienUuDaiMapper.toEntity(suKienUuDai);
  }
}
