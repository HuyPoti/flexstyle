import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class PhanHoiDto {
    //mã tài khoản
    @IsString({ message: 'Mã tài khoản phải là chuỗi ký tự.' })
    @IsNotEmpty({ message: 'Mã tài khoản không được để trống.' })
    MaTKKH: string;

    //mã sản phẩm
    @IsString({ message: 'Mã sản phẩm phải là chuỗi ký tự.' })
    @IsNotEmpty({ message: 'Mã sản phẩm không được để trống.' })
    MaSP: string;

    //đánh giá sao
    @IsNotEmpty({ message: 'Đánh giá sao không được để trống.' })
    SoSao: number;

    //Bình luận
    @IsString({ message: 'Bình luận phải là chuỗi ký tự.' })
    @IsNotEmpty({ message: 'Bình luận không được để trống.' })
    BinhLuan: string;

    //ngày tạo
    @IsNotEmpty({ message: 'Ngày tạo không được để trống.' })
    @IsDate({ message: 'Ngày tạo phải là kiểu ngày tháng.' })
    created_at?: Date;

    //ngày cập nhật
    @IsNotEmpty({ message: 'Ngày cập nhật không được để trống.' })
    @IsDate({ message: 'Ngày cập nhật phải là kiểu ngày tháng.' })
    updated_at?: Date;
}