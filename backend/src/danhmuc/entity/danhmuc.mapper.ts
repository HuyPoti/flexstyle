import { DanhMucEntity } from './danhmuc.entity';

export class DanhMucMapper {
  static toEntity(prisma: any): DanhMucEntity {
    return new DanhMucEntity(
      prisma.MaDM,
      prisma.TenDM,
      prisma.TrangThai,
      prisma.Loai,
    );
  }

  static toEntityList(prismaList: any[]): DanhMucEntity[] {
    return prismaList.map(this.toEntity);
  }
}
