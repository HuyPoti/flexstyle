import { Transform } from 'class-transformer';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsBoolean,
  IsEnum,
  IsDate,
  IsDateString,
  isDateString,
  IsISO8601,
} from 'class-validator';
import { IsEndDateAfterStartDate } from 'src/decorators/is-end-date-after-start-date.decorator';
import { IsFutureOrToday } from 'src/decorators/is-future-or-today.decorator';

enum TrangThai {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export class SuKienUuDaiDto {
  @IsString({ message: 'Tên sự kiện ưu đãi phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên sự kiện ưu đãi không được để trống' })
  TenSK: string;

  //mô tả sự kiện
  @IsString({ message: 'Mô tả sự kiện ưu đãi phải là chuỗi' })
  @IsNotEmpty({ message: 'Mô tả sự kiện ưu đãi không được để trống' })
  MoTa: string;
  // Ngày bắt đầu sự kiện
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  NgayPH: Date;
  // Ngày kết thúc sự kiện
  @IsEndDateAfterStartDate('NgayPH', {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  NgayKT: Date;

  //trạng thái enum
  @IsEnum(TrangThai, { message: 'Trạng thái phải là  ACTIVE hoặc INACTIVE' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  TrangThai: TrangThai;
  //phan trăm giảm giá
  @IsInt({ message: 'Phần trăm giảm giá phải là số nguyên' })
  @IsNotEmpty({ message: 'Phần trăm giảm giá không được để trống' })
  PhanTramGiam: number;

  //   @IsDate({ message: 'Ngày tạo phải là ngày hợp lệ' })
  //   Created_at: Date;
  //   @IsDate({ message: 'Ngày cập nhật phải là ngày hợp lệ' })
  //   Updated_at: Date;
}

export class CreateSuKienUuDaiDto {
  @IsString({ message: 'Tên sự kiện ưu đãi phải là chuỗi' })
  @IsNotEmpty({ message: 'Tên sự kiện ưu đãi không được để trống' })
  TenSK: string;

  //mô tả sự kiện
  @IsString({ message: 'Mô tả sự kiện ưu đãi phải là chuỗi' })
  @IsNotEmpty({ message: 'Mô tả sự kiện ưu đãi không được để trống' })
  MoTa: string;
  // Ngày bắt đầu sự kiện
  @IsFutureOrToday({
    message: 'Ngày bắt đầu phải là hôm nay hoặc trong tương lai',
  })
  
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  NgayPH: Date;
  // Ngày kết thúc sự kiện
  @IsEndDateAfterStartDate('NgayPH', {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Ngày kết thúc không được để trống' })
  NgayKT: Date;

  //trạng thái enum
  @IsEnum(TrangThai, { message: 'Trạng thái phải là  ACTIVE hoặc INACTIVE' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  TrangThai: TrangThai;
  //phan trăm giảm giá
  @IsInt({ message: 'Phần trăm giảm giá phải là số nguyên' })
  @IsNotEmpty({ message: 'Phần trăm giảm giá không được để trống' })
  PhanTramGiam: number;
}
