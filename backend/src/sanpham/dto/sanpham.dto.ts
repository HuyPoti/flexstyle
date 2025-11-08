import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsEnum,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';
import { TrangThai } from '@prisma/client';

export class SanPhamDto {
  @IsString({ message: 'Tên sản phẩm phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Tên sản phẩm không được để trống.' })
  TenSP: string;

  @IsOptional()
  @IsString({ message: 'Mô tả sản phẩm phải là chuỗi ký tự.' })
  MoTa?: string;

  @IsArray({ message: 'Hình ảnh phải là một mảng chuỗi.' })
  @ArrayNotEmpty({ message: 'Phải có ít nhất một hình ảnh.' })
  @IsString({ each: true, message: 'Mỗi hình ảnh phải là chuỗi.' })
  HinhAnh: string[];

  @IsInt({ message: 'Giá bán phải là số nguyên.' })
  @Min(0, { message: 'Giá bán không được âm.' })
  GiaBan: number;

  @IsOptional()
  @IsInt({ message: 'Giá mua phải là số nguyên.' })
  @Min(0, { message: 'Giá mua không được âm.' })
  GiaMua: number;

  @IsOptional()
  @IsEnum(TrangThai, {
    message:
      'Trạng thái không hợp lệ. Giá trị hợp lệ: ' +
      Object.values(TrangThai).join(', '),
  })
  TrangThai?: TrangThai;

  @IsString({ message: 'Mã danh mục phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Mã danh mục không được để trống.' })
  MaDM: string;

  @IsString()
  MauSac: string;
  @IsString({ message: 'Slug phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Slug không được để trống.' })
  slug: string;
}
