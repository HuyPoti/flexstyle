import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { TrangThai, LoaiDanhMuc } from 'src/constant';

export class DanhMucDto {
  @IsString({ message: 'Tên danh mục phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  TenDM: string;

  @IsEnum(TrangThai, { message: 'Trạng thái phải là active hoặc inactive' })
  TrangThai: TrangThai;

  @IsEnum(LoaiDanhMuc, { message: 'Loại danh mục không hợp lệ' })
  Loai: LoaiDanhMuc;
}
