import { VoucherEntity } from "./voucher.entity";
export class VoucherMapper {
    static toEntity(prisma: any): VoucherEntity {
        return new VoucherEntity(
            prisma.MaVoucher,
            prisma.TenVoucher,
            prisma.MoTa,
            prisma.SoTien,
            prisma.FreeShip,
            prisma.NgayBatDau,
            prisma.NgayKetThuc,
            prisma.Dieukien,
            prisma.TrangThai,
            prisma.create_at
        );
    }

    static toEntityList(prismaList: any[]): VoucherEntity[] {
        return prismaList.map(this.toEntity);
    }
}