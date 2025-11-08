import { TrangThaiPhieuNhapHang } from "src/constant";

export class PhieuNhapHangEntity{
    MaPNH: string;
    MaNCC: string;
    MaNV: string;
    MaTKNVQL: string;
    MaTKNVXN?: string;
    NoiDung?: string;
    created_at: Date;
    TrangThai: string;
    constructor(
        MaPNH: string,
        MaNCC: string,
        MaNV: string,
        MaTKNVQL: string,
        created_at: Date,
        TrangThai: TrangThaiPhieuNhapHang,
        MaTKNVXN?: string,
        NoiDung?: string,
    ){
        this.MaPNH = MaPNH;
        this.MaNCC = MaNCC;
        this.MaNV = MaNV;
        this.MaTKNVQL = MaTKNVQL;
        this.MaTKNVXN = MaTKNVXN;
        this.NoiDung = NoiDung;
        this.created_at = created_at;
        this.TrangThai = TrangThai;
    }

}