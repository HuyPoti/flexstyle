import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { LoaiTB, PhuongThucTT } from 'src/constant';
import { Prisma } from '@prisma/client';

export class ThongBaoDto {
  @IsString()
  @IsOptional()
  MaTB?: string;

  @IsString()
  @IsNotEmpty()
  Loai: LoaiTB;

  @IsString()
  @ValidateIf((o) => o.Loai === LoaiTB.VOUCHER)
  MaVoucher?: string;

  @IsString()
  @ValidateIf((o) => o.Loai === LoaiTB.SUKIENUUDAI)
  MaSK?: string;
}
