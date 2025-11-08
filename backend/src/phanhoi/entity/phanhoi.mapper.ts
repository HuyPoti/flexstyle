import { PhanHoiEntity } from './phanhoi.entity';
export class PhanHoiMapper {
    static toEntity(phanHoiDto: any): any {
        return {
            MaPH: phanHoiDto.MaPH,
            MaTKKH: phanHoiDto.MaTKKH,
            MaSP: phanHoiDto.MaSP,
            SoSao: phanHoiDto.SoSao,
            BinhLuan: phanHoiDto.BinhLuan,
            created_at: phanHoiDto.created_at,
            updated_at: phanHoiDto.updated_at,
        };
    }

    static toEntityList(phanHoiDtos: any[]): PhanHoiEntity[] {
        return phanHoiDtos.map(this.toEntity);
    }
}