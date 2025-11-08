import { IsDate, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Type } from 'class-transformer';
import { TrangThaiPhieuNhapHang } from "src/constant";

export class PhieuNhapHangDto{
    @IsNotEmpty({message: 'Mã nhà cung cấp không được để trống'})
    @IsString({message: 'Mã nhà cung cấp phải là chuỗi'})
    MaNCC: string;

    /*
    @IsNotEmpty({message: 'Mã nhân viên không được để trống'})
    @IsString({message: 'Mã nhân viên phải là chuỗi'})
    MaNV: string;*/

    @IsNotEmpty({message: 'Mã tài khoản nhân viên quản lý không được để trống'})
    @IsString({message: 'Mã tài khoản nhân viên quản lý phải là chuỗi'})
    MaTKNVQL: string;

    /*
    @IsString({message: 'Mã tài khoản nhân viên xác nhận phải là chuỗi'})
    MaTKNVXN?: string;*/

    /*
    @IsString({message: 'Nội dung phải là chuỗi'})
    NoiDung?: string;*/

    @Type(() => Date)
    @IsDate({message: 'Ngày nhập không hợp lệ'})
    @IsNotEmpty({message: 'Ngày nhập không được để trống'})
    created_at: Date;

    @IsEnum(TrangThaiPhieuNhapHang, {message: 'Trạng thái không hợp lệ'})
    @IsNotEmpty({message: 'Trạng thái không được để trống'})
    TrangThai: TrangThaiPhieuNhapHang;
}