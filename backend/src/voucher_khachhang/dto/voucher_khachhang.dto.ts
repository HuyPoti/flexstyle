import { IsDate, IsEnum, IsNotEmpty } from 'class-validator';
import { TrangThai } from 'src/constant';
export class VoucherKhachHangDto {
  @IsNotEmpty({ message: 'Mã khách hàng không được để trống' })
  MaTKKH: string;

  @IsNotEmpty({ message: 'Mã voucher không được để trống' })
  MaVoucher: string;

  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  @IsEnum(TrangThai, { message: 'Trạng thái phải là active hoặc inactive' })
  TrangThai: string;

  @IsNotEmpty({ message: 'Ngày tạo không được để trống' })
  @IsDate({ message: 'Ngày tạo không hợp lệ' })
  created_at: Date;

  @IsNotEmpty({ message: 'Ngày cập nhật không được để trống' })
  @IsDate({ message: 'Ngày cập nhật không hợp lệ' })
  updated_at: Date;

  @IsDate({ message: 'Hạn sử dụng không hợp lệ' })
  Hsd: Date;
}
