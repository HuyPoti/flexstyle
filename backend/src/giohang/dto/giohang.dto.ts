import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: 'Mã chi tiết sản phẩm', example: 'uuid-string' })
  @IsNotEmpty()
  @IsString()
  MaCTSP?: string;

  @ApiProperty({ description: 'Số lượng sản phẩm', example: 1, minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  SoLuong?: number;
}

export class UpdateQuantityDto {
  @ApiProperty({ description: 'Số lượng mới', example: 2, minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  SoLuong: number;
}

export class CartItemResponseDto {
  @ApiProperty({ description: 'Mã chi tiết giỏ hàng' })
  MaCTGH: string;

  @ApiProperty({ description: 'Số lượng' })
  SoLuong: number;

  @ApiProperty({ description: 'Thông tin chi tiết sản phẩm' })
  CHITIETSANPHAM: {
    MaCTSP: string;
    KichCo: string;
    SoLuong: number;
    SANPHAM: {
      MaSP: string;
      TenSP: string;
      GiaBan: number;
      MoTa: string | null;
      MauSac: string;
      HinhAnh: Array<string>;
    };
  };
}

// export class CartResponseDto {
//   items?: CartItemResponseDto[];
// }
