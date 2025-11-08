import { LoaiVoucher, TrangThai } from "src/constant";
export class VoucherEntity {
    MaVoucher: string;
    TenVoucher: string;
    MoTa: string;
    SoTien?: number;
    FreeShip: boolean;
    NgayBatDau: Date;
    NgayKetThuc: Date;
    DieuKien?: number;
    Loai: LoaiVoucher;
    Code: string;
    TrangThai: TrangThai;
    create_at: Date;
    constructor(
        MaVoucher: string,
        TenVoucher: string,
        MoTa: string,
        FreeShip: boolean,
        NgayBatDau: Date,
        NgayKetThuc: Date,
        Loai: LoaiVoucher,
        Code: string,
        TrangThai: TrangThai,
        create_at: Date,
        DieuKien?: number,
        SoTien?: number,
    ) {
        this.MaVoucher = MaVoucher;
        this.TenVoucher = TenVoucher;
        this.MoTa = MoTa;
        this.SoTien = SoTien;
        this.FreeShip = FreeShip;
        this.NgayBatDau = NgayBatDau;
        this.NgayKetThuc = NgayKetThuc;
        this.DieuKien = DieuKien;
        this.Loai = Loai;
        this.Code = Code;
        this.TrangThai = TrangThai;
        this.create_at = create_at;
    }
}