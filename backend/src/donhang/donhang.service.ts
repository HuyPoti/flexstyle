import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DonhangRepository } from 'src/repositories/donhang.repository';
import {
  CreateDonhangDto,
  UpdateDonhangStatusDto,
  TrangThaiDonHang,
} from './dto/donhang.dto';

@Injectable()
export class DonhangService {
  constructor(private readonly donhangRepository: DonhangRepository) {}

  /**
   * Tạo đơn hàng mới
   */
  async createOrder(createDto: CreateDonhangDto) {
    // Lấy thông tin chi tiết sản phẩm
    const productDetail = await this.donhangRepository.getProductDetail(
      createDto.MaCTSP,
    );

    if (!productDetail) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    // Kiểm tra số lượng trong kho
    if (productDetail.SoLuong < createDto.SoLuong) {
      throw new BadRequestException(
        `Không đủ hàng trong kho. Số lượng còn lại: ${productDetail.SoLuong}`,
      );
    }

    // Kiểm tra trạng thái sản phẩm
    if (
      productDetail.TrangThaiSP === 'HET_HANG'
      // productDetail.TrangThaiSP === 'TAM_NGUNG'
    ) {
      throw new BadRequestException('Sản phẩm hiện không khả dụng');
    }

    // // Tính tổng tiền
    // let tongTien = productDetail.SANPHAM.GiaBan * createDto.SoLuong;
    // let discount = 0;

    // // Áp dụng voucher nếu có
    // if (createDto.MaVoucher) {
    //   const voucher = await this.donhangRepository.getVoucher(
    //     createDto.MaVoucher,
    //   );

    //   if (!voucher) {
    //     throw new NotFoundException('Không tìm thấy voucher');
    //   }

    //   if (voucher.TrangThai !== 'ACTIVE') {
    //     throw new BadRequestException('Voucher không còn hiệu lực');
    //   }

    //   // Kiểm tra điều kiện áp dụng voucher
    //   if (voucher.Loai == 'GiamGia') {
    //     if (
    //       voucher.Dieukien != null &&
    //       voucher.SoTien != null &&
    //       tongTien < voucher.Dieukien
    //     ) {
    //       throw new BadRequestException(
    //         `Đơn hàng phải đạt tối thiểu ${voucher.Dieukien.toLocaleString('vi-VN')}đ để sử dụng voucher này`,
    //       );
    //     }

    //     // Kiểm tra thời gian voucher
    //     const now = new Date();
    //     if (now < voucher.NgayBatDau || now > voucher.NgayKetThuc) {
    //       throw new BadRequestException(
    //         'Voucher đã hết hạn hoặc chưa đến thời gian sử dụng',
    //       );
    //     }

    //     discount += voucher.SoTien || 0;
    //   } else if (voucher.Loai == 'FreeShip') {
    //     // Giả sử phí vận chuyển cố định là 30,000 VND
    //     const shippingFee = 30000;
    //     discount += shippingFee;
    //   }
    // }

    // Áp dụng sự kiện ưu đãi nếu có
    // if (createDto.MaSK) {
    //   const promotion = await this.donhangRepository.getPromotion(
    //     createDto.MaSK,
    //   );

    //   if (!promotion) {
    //     throw new NotFoundException('Không tìm thấy sự kiện ưu đãi');
    //   }

    //   if (promotion.TrangThai !== 'ACTIVE') {
    //     throw new BadRequestException('Sự kiện ưu đãi không còn hiệu lực');
    //   }

    //   // Kiểm tra thời gian sự kiện
    //   const now = new Date();
    //   if (now < promotion.NgayPH || now > promotion.NgayKT) {
    //     throw new BadRequestException(
    //       'Sự kiện ưu đãi đã kết thúc hoặc chưa bắt đầu',
    //     );
    //   }

    //   // Tính phần trăm giảm giá
    //   const promotionDiscount = (tongTien * promotion.PhanTramGiam) / 100;
    //   discount += promotionDiscount;
    // }

    // // Tính tổng tiền sau giảm giá
    // tongTien = Math.max(tongTien - discount, 0);

    // Tạo đơn hàng
    const order = await this.donhangRepository.createOrder({
      MaDH: createDto.MaDH,
      SoLuong: createDto.SoLuong,
      TongTien: createDto.TongTien,
      MaCTSP: createDto.MaCTSP,
      MaTK_KH: createDto.MaTK_KH,
      MaVoucher: createDto.MaVoucher,
      MaSK: createDto.MaSK,
      TenNM: createDto.TenNM,
      SoDienThoai: createDto.SoDienThoai,
      DiaChi: createDto.DiaChi,
    });

    // Cập nhật số lượng trong kho
    await this.donhangRepository.updateProductStock(
      createDto.MaCTSP,
      createDto.SoLuong,
    );

    return this.mapToResponseDto(order);
  }

  /**
   * Lấy danh sách tất cả đơn hàng
   */
  async getAllOrders(MaTK_KH?: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const { orders, total } =
      await this.donhangRepository.findAllOrdersForCustomer({
        MaTK_KH,
        skip,
        take: limit,
      });

    return { orders, total };
  }

  async getAllOrderForStaff(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const orders = await this.donhangRepository.findAllOrdersForStaff({
      skip,
      take: limit,
    });
    return orders;
  }
  /**
   * Lấy chi tiết đơn hàng
   */
  async getOrderById(MaDH: string) {
    const order = await this.donhangRepository.findOrderById(MaDH);

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    return this.mapToResponseDto(order);
  }

  /**
   * Cập nhật trạng thái đơn hàng
   */
  async updateOrderStatus(MaDH: string, updateDto: UpdateDonhangStatusDto) {
    const existingOrder = await this.donhangRepository.findOrderById(MaDH);

    if (!existingOrder) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Lấy trạng thái hiện tại
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Kiểm tra logic chuyển trạng thái
    if (
      currentStatus === TrangThaiDonHang.HUY ||
      currentStatus === TrangThaiDonHang.DA_GIAO ||
      currentStatus === TrangThaiDonHang.XAC_NHAN_LOI
    ) {
      throw new BadRequestException(
        'Không thể cập nhật trạng thái cho đơn hàng đã giao, đã hủy hoặc đã xác nhận lỗi',
      );
    }

    const updatedOrder = await this.donhangRepository.updateOrderStatus(
      MaDH,
      updateDto.TrangThai,
    );

    return this.mapToResponseDto(updatedOrder);
  }

  /**
   * Hủy đơn hàng
   */
  async cancelOrder(MaDH: string) {
    const existingOrder = await this.donhangRepository.findOrderById(MaDH);

    if (!existingOrder) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Lấy trạng thái hiện tại
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Chỉ cho phép hủy đơn hàng chưa giao hoặc đang giao
    if (currentStatus === TrangThaiDonHang.DA_GIAO) {
      throw new BadRequestException('Không thể hủy đơn hàng đã giao');
    }

    if (currentStatus === TrangThaiDonHang.HUY) {
      throw new BadRequestException('Đơn hàng đã được hủy trước đó');
    }

    if (currentStatus === TrangThaiDonHang.XAC_NHAN_LOI) {
      throw new BadRequestException('Không thể hủy đơn hàng đã xác nhận lỗi');
    }

    // Khôi phục số lượng sản phẩm trong kho
    await this.donhangRepository.restoreProductStock(
      existingOrder.MaCTSP,
      existingOrder.SoLuong,
    );

    // Cập nhật trạng thái đơn hàng thành HUY
    const cancelledOrder = await this.donhangRepository.cancelOrder(MaDH);

    return this.mapToResponseDto(cancelledOrder);
  }

  /**
   * Xóa đơn hàng hoàn toàn
   */
  async deleteOrder(MaDH: string): Promise<{ message: string }> {
    const existingOrder = await this.donhangRepository.findOrderById(MaDH);

    if (!existingOrder) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Lấy trạng thái hiện tại
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Chỉ cho phép xóa đơn hàng đã hủy, đã giao hoặc đã xác nhận lỗi
    if (
      currentStatus !== TrangThaiDonHang.HUY &&
      currentStatus !== TrangThaiDonHang.DA_GIAO &&
      currentStatus !== TrangThaiDonHang.XAC_NHAN_LOI
    ) {
      throw new BadRequestException(
        'Chỉ có thể xóa đơn hàng đã giao, đã hủy hoặc đã xác nhận lỗi',
      );
    }

    await this.donhangRepository.deleteOrder(MaDH);

    return {
      message: 'Xóa đơn hàng thành công',
    };
  }

  /**
   * Lấy tổng hợp thông tin đơn hàng
   */
  async getOrderSummary(MaTK_KH?: string) {
    return await this.donhangRepository.getOrderSummary(MaTK_KH);
  }

  /**
   * Map dữ liệu từ Prisma sang DTO
   */
  private mapToResponseDto(order: any) {
    return {
      MaDH: order.MaDH,
      created_at: order.created_at,
      SoLuong: order.SoLuong,
      TongTien: order.TongTien,
      CHITIETSANPHAM: {
        MaCTSP: order.CHITIETSANPHAM.MaCTSP,
        KichCo: order.CHITIETSANPHAM.KichCo,
        SoLuong: order.CHITIETSANPHAM.SoLuong,
        SANPHAM: {
          MaSP: order.CHITIETSANPHAM.SANPHAM.MaSP,
          TenSP: order.CHITIETSANPHAM.SANPHAM.TenSP,
          GiaBan: order.CHITIETSANPHAM.SANPHAM.GiaBan,
          MoTa: order.CHITIETSANPHAM.SANPHAM.MoTa,
          MauSac: order.CHITIETSANPHAM.SANPHAM.MauSac,
          HinhAnh: order.CHITIETSANPHAM.SANPHAM.HinhAnh,
        },
      },
      VOUCHER: order.VOUCHER
        ? {
            MaVoucher: order.VOUCHER.MaVoucher,
            TenVoucher: order.VOUCHER.TenVoucher,
            SoTien: order.VOUCHER.SoTien,
            FreeShip: order.VOUCHER.FreeShip,
          }
        : null,
      SUKIENUUDAI: order.SUKIENUUDAI
        ? {
            MaSK: order.SUKIENUUDAI.MaSK,
            TenSK: order.SUKIENUUDAI.TenSK,
            PhanTramGiam: order.SUKIENUUDAI.PhanTramGiam,
          }
        : null,
      KHACHHANG_ACCOUNT: order.KHACHHANG_ACCOUNT
        ? {
            MaTK: order.KHACHHANG_ACCOUNT.MaTK,
            Username: order.KHACHHANG_ACCOUNT.Username,
            Avatar: order.KHACHHANG_ACCOUNT.Avatar,
          }
        : null,
      TINHTRANGDONHANG: order.TINHTRANGDONHANG.map((status: any) => ({
        MaTTDH: status.MaTTDH,
        TrangThai: status.TrangThai,
        created_at: status.created_at,
      })),
    };
  }

  // Thêm trạng thái đơn hàng
  async addOrderStatus(body: { MaDH: string; TrangThai: TrangThaiDonHang }) {
    const existingOrder = await this.donhangRepository.findOrderById(
      body.MaDH,
    );

    if (!existingOrder) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Kiểm tra trạng thái hiện tại
    const currentStatus = existingOrder.TINHTRANGDONHANG[0]?.TrangThai;

    // Chỉ cho phép thêm trạng thái nếu đơn hàng chưa hoàn tất
    if (currentStatus === TrangThaiDonHang.DA_GIAO || currentStatus === TrangThaiDonHang.HUY) {
      throw new BadRequestException('Không thể thêm trạng thái cho đơn hàng đã giao');
    }

    // Thêm trạng thái mới
    const newStatus = await this.donhangRepository.addOrderStatus(body);

    return newStatus;
  }
}