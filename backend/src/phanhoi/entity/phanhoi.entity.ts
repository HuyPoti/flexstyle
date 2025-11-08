export class PhanHoiEntity {
    MaPH: string;
    MaTKKH: string;
    MaSP: string;
    SoSao: number;
    BinhLuan: string;
    created_at?: Date;
    updated_at?: Date;
    constructor(
        MaPH: string,
        MaTKKH: string,
        MaSP: string,
        SoSao: number,
        BinhLuan: string,
        created_at?: Date,
        updated_at?: Date,
    ) {
        this.MaPH = MaPH;
        this.MaTKKH = MaTKKH;
        this.MaSP = MaSP;
        this.SoSao = SoSao;
        this.BinhLuan = BinhLuan;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}