import { TrangThai } from 'src/constant';
export class SuKienUuDai {
  MaSK: string;
  TenSK: string;
  MoTa: string;
  NgayPH: Date;
  NgayKT: Date;
  PhanTramGiam: number;
  TrangThai: TrangThai;
  created_at: Date;
  updated_at: Date;
  constructor(
    MaSK: string,
    TenSK: string,
    MoTa: string,
    NgayPH: Date,
    NgayKT: Date,
    PhanTramGiam: number,
    TrangThai: TrangThai,
    created_at: Date,
    updated_at: Date,
  ) {
    this.MaSK = MaSK;
    this.TenSK = TenSK;
    this.MoTa = MoTa;
    this.NgayPH = NgayPH;
    this.NgayKT = NgayKT;
    this.PhanTramGiam = PhanTramGiam;
    this.TrangThai = TrangThai;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }
}
