import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PhuongThucTT } from "src/constant";
import { Prisma } from "@prisma/client";

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    MaDH: string;

    @IsString()
    @IsNotEmpty()
    MaKH: string;

    @IsNotEmpty()
    @IsEnum(['VNPAY', 'PAYPAL'])
    PhuongThuc: PhuongThucTT;

    @IsNotEmpty()
    @IsNumber()
    SoTien: number;

    @IsString()
    @IsNotEmpty()
    MaGD: string;
}