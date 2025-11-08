export class VoucherKhachHangEntity {
  MaVCKH: string;
  MaTKKH: string;
  MaVoucher: string;
  TrangThai: string;
  created_at: Date;
  updated_at: Date;
  Hsd: Date;
  constructor(
    MaVCKH: string,
    MaTKKH: string,
    MaVoucher: string,
    TrangThai: string,
    created_at: Date,
    updated_at: Date,
    Hsd: Date,
  ) {
    this.MaVCKH = MaVCKH;
    this.MaTKKH = MaTKKH;
    this.MaVoucher = MaVoucher;
    this.TrangThai = TrangThai;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.Hsd = Hsd;
  }
}
