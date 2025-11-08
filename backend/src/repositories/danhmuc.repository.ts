import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { DanhMucMapper } from 'src/danhmuc/entity/danhmuc.mapper';
import { TrangThai } from 'src/constant';
import { LoaiDanhMuc } from '@prisma/client';

@Injectable()
export class DanhMucRepository {
  constructor(private readonly prisma: PrismaService) {}
  //tìm tất cả danh mục
  async findAll() {
    const danhmucs = await this.prisma.dANHMUC.findMany();
    return danhmucs ? DanhMucMapper.toEntityList(danhmucs) : [];
  }
  //tìm danh mục theo id
  async findById(id: string) {
    const danhmuc = await this.prisma.dANHMUC.findUnique({
      where: { MaDM: id },
    });
    return danhmuc ? DanhMucMapper.toEntity(danhmuc) : null;
  }
  //tim danh mục theo tên
  async findByName(name: string) {
    return await this.prisma.dANHMUC.findFirst({
      where: { TenDM: name },
    });
  }
  //tạo mới danh mục
  async createDanhMuc(newdata: any) {
    const danhmuc = await this.prisma.dANHMUC.create({
      data: newdata,
    });
    return danhmuc ? DanhMucMapper.toEntity(danhmuc) : null;
  }
  //chỉnh sửa danh mục dựa trên id là chuỗi
  async updateDanhMuc(MaDM: string, updatedata: any) {
    const danhmuc = await this.prisma.dANHMUC.update({
      where: { MaDM },
      data: updatedata,
    });

    return danhmuc ? DanhMucMapper.toEntity(danhmuc) : null;
  }
  //thay đổi trạng thái biết trạng thái là kiểu enum
  async changeTrangThai(MaDM: string, TrangThai: TrangThai) {
    const danhmuc = await this.prisma.dANHMUC.update({
      where: { MaDM },
      data: {
        TrangThai,
        updated_at: new Date(),
      },
    });
    return DanhMucMapper.toEntity(danhmuc);
  }
  //thay đổi loại danh mục biết loại là kiểu enum
  async changeLoai(MaDM: string, Loai: LoaiDanhMuc) {
    const danhmuc = await this.prisma.dANHMUC.update({
      where: { MaDM },
      data: {
        Loai,
        updated_at: new Date(),
      },
    });
    return DanhMucMapper.toEntity(danhmuc);
  }
}
