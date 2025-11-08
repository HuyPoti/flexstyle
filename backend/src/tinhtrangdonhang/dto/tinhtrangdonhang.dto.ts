import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

// Enum for order status
export enum TrangThaiDonHang {
  CHUA_GIAO = 'CHUA_GIAO',
  DANG_GIAO = 'DANG_GIAO',
  DA_GIAO = 'DA_GIAO',
  HUY = 'HUY',
  LOI = 'LOI',
  XAC_NHAN_LOI = 'XAC_NHAN_LOI',
}

// DTO for creating order status
export class CreateTinhtrangDonhangDto {
  @ApiProperty({ 
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123'
  })
  @IsString()
  @IsNotEmpty({ message: 'Mã đơn hàng không được để trống' })
  MaDH: string;

  @ApiProperty({ 
    description: 'Trạng thái đơn hàng',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.CHUA_GIAO
  })
  @IsEnum(TrangThaiDonHang, { message: 'Trạng thái đơn hàng không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  TrangThai: TrangThaiDonHang;
}

// DTO for updating order status
export class UpdateTinhtrangDonhangDto {
  @ApiProperty({ 
    description: 'Trạng thái đơn hàng mới',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  @IsEnum(TrangThaiDonHang, { message: 'Trạng thái đơn hàng không hợp lệ' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống' })
  TrangThai: TrangThaiDonHang;
}

// Response DTO for order status
export class TinhtrangDonhangResponseDto {
  @ApiProperty({ description: 'Mã tình trạng đơn hàng', example: 'uuid-ttdh-123' })
  MaTTDH: string;

  @ApiProperty({ description: 'Ngày tạo', example: '2025-10-11T10:30:00Z' })
  created_at: Date;

  @ApiProperty({ 
    description: 'Trạng thái đơn hàng',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  TrangThai: TrangThaiDonHang;

  @ApiProperty({ description: 'Mã đơn hàng', example: 'uuid-dh-123', nullable: true })
  MaDH: string | null;

  @ApiProperty({ 
    description: 'Thông tin đơn hàng',
    nullable: true,
    example: {
      MaDH: 'uuid-dh',
      TongTien: 500000,
      created_at: '2025-10-11T10:00:00Z'
    }
  })
  DONHANG?: {
    MaDH: string;
    TongTien: number | null;
    created_at: Date;
  } | null;
}

// Response DTO for order status history
export class TinhtrangDonhangHistoryDto {
  @ApiProperty({ description: 'Mã đơn hàng', example: 'uuid-dh-123' })
  MaDH: string;

  @ApiProperty({ 
    description: 'Lịch sử trạng thái đơn hàng',
    type: [TinhtrangDonhangResponseDto]
  })
  history: TinhtrangDonhangResponseDto[];

  @ApiProperty({ description: 'Tổng số bản ghi', example: 5 })
  total: number;

  @ApiProperty({ 
    description: 'Trạng thái hiện tại',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO
  })
  currentStatus: TrangThaiDonHang;
}

// DTO for filtering order statuses
export class FilterTinhtrangDonhangDto {
  @ApiProperty({ 
    description: 'Mã đơn hàng (optional)',
    example: 'uuid-dh-123',
    required: false
  })
  @IsString()
  @IsOptional()
  MaDH?: string;

  @ApiProperty({ 
    description: 'Trạng thái đơn hàng (optional)',
    enum: TrangThaiDonHang,
    example: TrangThaiDonHang.DANG_GIAO,
    required: false
  })
  @IsEnum(TrangThaiDonHang, { message: 'Trạng thái đơn hàng không hợp lệ' })
  @IsOptional()
  TrangThai?: TrangThaiDonHang;
}

// Response DTO for status statistics
export class TinhtrangDonhangStatsDto {
  @ApiProperty({ description: 'Tổng số đơn hàng', example: 100 })
  total: number;

  @ApiProperty({ description: 'Số đơn chưa giao', example: 20 })
  chuaGiao: number;

  @ApiProperty({ description: 'Số đơn đang giao', example: 30 })
  dangGiao: number;

  @ApiProperty({ description: 'Số đơn đã giao', example: 40 })
  daGiao: number;

  @ApiProperty({ description: 'Số đơn đã hủy', example: 5 })
  huy: number;

  @ApiProperty({ description: 'Số đơn lỗi', example: 3 })
  loi: number;

  @ApiProperty({ description: 'Số đơn xác nhận lỗi', example: 2 })
  xacNhanLoi: number;
}
