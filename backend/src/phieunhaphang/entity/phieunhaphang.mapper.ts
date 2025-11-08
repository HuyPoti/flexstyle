import {PhieuNhapHangEntity} from './phieunhaphang.entity';
export class PhieuNhapHangMapper {
    static toEntity(prisma: any): PhieuNhapHangEntity {
        return new PhieuNhapHangEntity(
            prisma.MaPNH,
            prisma.MaNCC,
            prisma.MaNV,
            prisma.MaTKNVQL,
            prisma.created_at,
            prisma.TrangThai,
            prisma.MaTKNVXN,
            prisma.NoiDung,
        );
    }
    static toEntityList(prismaList: any[]): PhieuNhapHangEntity[] {
        return prismaList.map(this.toEntity);
    }
}