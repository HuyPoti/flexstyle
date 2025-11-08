import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';

export class CreateChiTietNhapHangDto {
  @IsNotEmpty()
  @IsString()
  MaCTSP: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  SoLuong: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  DonGia: number;
}
