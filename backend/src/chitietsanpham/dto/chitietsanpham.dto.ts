import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { KichCo, TrangThaiSP } from '@prisma/client';

export class ChiTietSanPhamDto {
  @IsEnum(KichCo, {
    message: `Kích cỡ không hợp lệ. Giá trị hợp lệ: ${Object.values(KichCo).join(', ')}`,
  })
  KichCo: KichCo;
  @IsOptional()
  @IsUUID('4', { message: 'Mã sản phẩm (MaSP) phải là UUID hợp lệ' })
  MaSP: string;

  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(0, { message: 'Số lượng không được âm' })
  SoLuong: number;

  @IsOptional()
  @IsEnum(TrangThaiSP, {
    message: `Trạng thái không hợp lệ. Giá trị hợp lệ: ${Object.values(TrangThaiSP).join(', ')}`,
  })
  TrangThaiSP?: TrangThaiSP;
}
