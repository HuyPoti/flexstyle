import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsNotEmpty, Min, IsEnum } from 'class-validator';
import { UUID } from 'crypto';

// Enum for order status
export enum TrangThaiDonHang {
  CHUA_GIAO = 'CHUA_GIAO',
  DANG_GIAO = 'DANG_GIAO',
  DA_GIAO = 'DA_GIAO',
  HUY = 'HUY',
  LOI = 'LOI',
  XAC_NHAN_LOI = 'XAC_NHAN_LOI',
}

// DTO for creating order
export class CreateDonhangDto {
  //mã đơn hàng kiểu uuid
  @ApiProperty({ 
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123'
  })
  @IsString()
  @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
  MaDH: string;
  //mã chi tiết sản phẩm    
  @ApiProperty({ 
    description: 'Mã chi tiết sản phẩm',
    example: 'uuid-ctsp-123'
  })
  @IsString()
  @IsNotEmpty({ message: 'Mã chi tiết sản phẩm không được để trống' })
  MaCTSP: string;

  @ApiProperty({ 
    description: 'Số lượng sản phẩm đặt hàng',
    example: 2,
    minimum: 1
  })
  @IsInt({ message: 'Số lượng phải là số nguyên' })
  @Min(1, { message: 'Số lượng phải lớn hơn 0' })
  SoLuong: number;

  @ApiProperty({ 
    description: 'Mã tài khoản khách hàng',
    example: 'uuid-tk-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaTK_KH?: string;

  @ApiProperty({ 
    description: 'Mã voucher áp dụng',
    example: 'uuid-voucher-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaVoucher?: string;

  @ApiProperty({ 
    description: 'Mã sự kiện ưu đãi',
    example: 'uuid-sk-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaSK?: string;

  //địa chỉ
  @ApiProperty({
    description: 'Địa chỉ giao hàng',
    example: '123 Đường ABC, Quận 1, TP.HCM'
  })
  @IsString()
  @IsNotEmpty({ message: 'Địa chỉ giao hàng không được để trống' })
  DiaChi: string;

  //số điện thoại
  @ApiProperty({
    description: 'Số điện thoại liên hệ',
    example: '0909123456'
  })
  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  SoDienThoai: string;

  //tổng tiền
  @ApiProperty({
    description: 'Tổng tiền đơn hàng',
    example: 500000
  })
  @IsInt({ message: 'Tổng tiền phải là số nguyên' })
  @Min(0, { message: 'Tổng tiền không được âm' })
  TongTien: number;
  //hoten nguoi nhan
  @ApiProperty({
    description: 'Họ tên người nhận hàng',
    example: 'Nguyễn Văn A'
  })
  @IsString()
  @IsNotEmpty({ message: 'Họ tên người nhận không được để trống' })
  TenNM: string;
}

//create tình trạng đơn hàng
export class CreateDonhangStatusDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
  MaDH: string;
  @IsEnum(TrangThaiDonHang, { message: 'Trạng thái đơn hàng không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  TrangThai: TrangThaiDonHang;
}

// DTO for updating order status
export class UpdateDonhangStatusDto {
  @ApiProperty({ 
    description: 'Trạng thái đơn hàng',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  @IsEnum(TrangThaiDonHang, { message: 'Trạng thái đơn hàng không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  TrangThai: TrangThaiDonHang;
}

// Response DTO for order details
export class DonhangResponseDto {
  @ApiProperty({ description: 'Mã đơn hàng', example: 'uuid-dh-123' })
  MaDH: string;

  @ApiProperty({ description: 'Ngày tạo đơn hàng', example: '2025-10-11T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ description: 'Số lượng sản phẩm', example: 2 })
  SoLuong: number;

  @ApiProperty({ description: 'Tổng tiền', example: 500000, nullable: true })
  TongTien: number | null;

  @ApiProperty({ 
    description: 'Chi tiết sản phẩm',
    example: {
      MaCTSP: 'uuid-ctsp',
      KichCo: 'L',
      SANPHAM: {
        MaSP: 'uuid-sp',
        TenSP: 'Áo khoác bomber',
        GiaBan: 250000,
        MoTa: 'Áo khoác bomber chất liệu cao cấp',
        MauSac: 'Black',
        HinhAnh: ['url1', 'url2']
      }
    }
  })
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
      HinhAnh: string[];
    };
  };

  @ApiProperty({ 
    description: 'Thông tin voucher',
    nullable: true,
    example: {
      MaVoucher: 'uuid-voucher',
      TenVoucher: 'Giảm 10%',
      SoTien: 50000
    }
  })
  VOUCHER: {
    MaVoucher: string;
    TenVoucher: string;
    SoTien: number;
    FreeShip: boolean;
  } | null;

  @ApiProperty({ 
    description: 'Thông tin sự kiện ưu đãi',
    nullable: true,
    example: {
      MaSK: 'uuid-sk',
      TenSK: 'Black Friday',
      PhanTramGiam: 20
    }
  })
  SUKIENUUDAI: {
    MaSK: string;
    TenSK: string;
    PhanTramGiam: number;
  } | null;

  @ApiProperty({ 
    description: 'Thông tin khách hàng',
    nullable: true,
    example: {
      MaTK: 'uuid-tk',
      Username: 'nguyenvana',
      Avatar: 'url-avatar'
    }
  })
  KHACHHANG_ACCOUNT: {
    MaTK: string;
    Username: string | null;
    Avatar: string | null;
  } | null;

  @ApiProperty({ 
    description: 'Danh sách tình trạng đơn hàng',
    example: [
      {
        MaTTDH: 'uuid-ttdh-1',
        TrangThai: 'CHUA_GIAO',
        created_at: '2025-10-11T10:30:00Z'
      },
      {
        MaTTDH: 'uuid-ttdh-2',
        TrangThai: 'DANG_GIAO',
        created_at: '2025-10-11T14:00:00Z'
      }
    ]
  })
  TINHTRANGDONHANG: {
    MaTTDH: string;
    TrangThai: string;
    created_at: Date;
  }[];
}

// Response DTO for order list
export class DonhangListResponseDto {
  @ApiProperty({ description: 'Danh sách đơn hàng' })
  orders: DonhangResponseDto[];

  @ApiProperty({ description: 'Tổng số đơn hàng', example: 25 })
  total: number;
}
