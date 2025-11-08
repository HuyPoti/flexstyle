import { IsBoolean, IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';
import { IsEndDateAfterStartDate } from 'src/decorators/is-end-date-after-start-date.decorator';
import { IsFutureOrToday } from 'src/decorators/is-future-or-today.decorator';
import { TrangThai, LoaiVoucher } from 'src/constant';
export class VoucherDto {
    @IsString({ message: 'Tên voucher phải là chuỗi' })
    @IsNotEmpty({ message: 'Tên voucher không được để trống' })
    TenVoucher: string;
    //mô tả voucher
    @IsString({ message: 'Mô tả voucher phải là chuỗi' })
    @IsNotEmpty({ message: 'Mô tả voucher không được để trống' })
    MoTa: string;
    //Số tiền giảm
    @IsInt({ message: 'Số tiền giảm phải là số nguyên' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    SoTien?: number;

    //Loại voucher
    @IsEnum(LoaiVoucher, { message: 'Loại voucher phải là FreeShip hoặc GiamGia' })
    @IsNotEmpty({ message: 'Loại voucher không được để trống' })
    Loai: LoaiVoucher;

    //Code voucher
    @IsString({ message: 'Code voucher phải là chuỗi' })
    @IsNotEmpty({ message: 'Code voucher không được để trống' })
    Code: string;

    @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
    @IsFutureOrToday({ message: 'Ngày bắt đầu phải là ngày hiện tại hoặc tương lai' })
    NgayBatDau: string;

    @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
    @IsEndDateAfterStartDate('NgayBatDau', { message: 'Ngày kết thúc phải sau ngày bắt đầu' })
    NgayKetThuc: string;

    //điều kiện áp dụng
    @IsInt({ message: 'Điều kiện áp dụng phải là số nguyên' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    Dieukien?: number;

    @IsEnum(TrangThai, { message: 'Trạng thái phải là active hoặc inactive' })
    TrangThai: TrangThai;

    //Số lượng voucher
    @IsInt({ message: 'Số lượng voucher phải là số nguyên' })
    @IsNotEmpty({ message: 'Số lượng voucher không được để trống' })
    SoLuong: number;
}
export class CreateVoucherDto {
    @IsString({ message: 'Tên voucher phải là chuỗi' })
    @IsNotEmpty({ message: 'Tên voucher không được để trống' })
    TenVoucher: string;
    //mô tả voucher
    @IsString({ message: 'Mô tả voucher phải là chuỗi' })
    @IsNotEmpty({ message: 'Mô tả voucher không được để trống' })
    MoTa: string;
    //Số tiền giảm
    @IsNumber({}, { message: 'Số tiền giảm phải là số nguyên' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    SoTien?: number;

    //Loại voucher
    @IsEnum(LoaiVoucher, { message: 'Loại voucher phải là FreeShip hoặc GiamGia' })
    @IsNotEmpty({ message: 'Loại voucher không được để trống' })
    Loai: LoaiVoucher;

    //Code voucher
    @IsString({ message: 'Code voucher phải là chuỗi' })
    @IsNotEmpty({ message: 'Code voucher không được để trống' })
    Code: string;

    @IsDateString({}, { message: 'Ngày bắt đầu không hợp lệ' })
    NgayBatDau: string;

    @IsDateString({}, { message: 'Ngày kết thúc không hợp lệ' })
    @IsEndDateAfterStartDate('NgayBatDau', { message: 'Ngày kết thúc phải sau ngày bắt đầu' })
    NgayKetThuc: string;

    //điều kiện áp dụng
    @IsNumber({}, { message: 'Điều kiện áp dụng phải là số nguyên' })
    @ValidateIf(o => o.Loai === LoaiVoucher.GiamGia)
    Dieukien?: number;

    @IsEnum(TrangThai, { message: 'Trạng thái phải là active hoặc inactive' })
    TrangThai: TrangThai;

    //Số lượng voucher
    @IsNumber({}, { message: 'Số lượng voucher phải là số nguyên' })
    @IsNotEmpty({ message: 'Số lượng voucher không được để trống' })
    SoLuong: number;
}