import { IsString, IsOptional, IsEnum } from 'class-validator';

// Define enums locally since Prisma exports are not working properly
import { VaiTro } from '../enums';

enum TrangThai {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export class TaiKhoanDto {
  @IsOptional()
  @IsString()
  Username?: string | null;

  @IsOptional()
  @IsString()
  DisplayName?: string | null;

  @IsOptional()
  @IsEnum(TrangThai)
  Status?: TrangThai;

  @IsOptional()
  @IsEnum(VaiTro)
  VAITRO?: VaiTro;

  @IsString()
  MaTK: string;

  @IsOptional()
  @IsString()
  Email?: string | null;
}
