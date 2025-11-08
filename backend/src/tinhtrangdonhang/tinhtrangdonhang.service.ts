import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TinhtrangDonhangRepository } from 'src/repositories/tinhtrangdonhang.repository';
import {
  CreateTinhtrangDonhangDto,
  UpdateTinhtrangDonhangDto,
  TinhtrangDonhangResponseDto,
  TinhtrangDonhangHistoryDto,
  TinhtrangDonhangStatsDto,
  TrangThaiDonHang,
} from './dto/tinhtrangdonhang.dto';

@Injectable()
export class TinhtrangDonhangService {
  constructor(
    private readonly tinhtrangDonhangRepository: TinhtrangDonhangRepository
  ) {}

  /**
   * Tạo tình trạng đơn hàng mới
   */
  async createOrderStatus(
    createDto: CreateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    // Kiểm tra đơn hàng tồn tại
    const orderExists = await this.tinhtrangDonhangRepository.orderExists(
      createDto.MaDH
    );

    if (!orderExists) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Tạo tình trạng mới
    const orderStatus = await this.tinhtrangDonhangRepository.createOrderStatus({
      MaDH: createDto.MaDH,
      TrangThai: createDto.TrangThai,
    });

    return this.mapToResponseDto(orderStatus);
  }

  /**
   * Cập nhật trạng thái đơn hàng (tạo bản ghi mới)
   */
  async updateOrderStatus(
    MaDH: string,
    updateDto: UpdateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    // Kiểm tra đơn hàng tồn tại
    const order = await this.tinhtrangDonhangRepository.getOrder(MaDH);

    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    // Lấy trạng thái hiện tại
    const currentStatus = await this.tinhtrangDonhangRepository.getCurrentOrderStatus(
      MaDH
    );

    // Kiểm tra logic chuyển trạng thái
    if (currentStatus) {
      this.validateStatusTransition(
        currentStatus.TrangThai as TrangThaiDonHang,
        updateDto.TrangThai
      );
    }

    // Tạo bản ghi trạng thái mới
    const newStatus = await this.tinhtrangDonhangRepository.updateOrderStatus(
      MaDH,
      updateDto.TrangThai
    );

    return this.mapToResponseDto(newStatus);
  }

  /**
   * Lấy tất cả tình trạng đơn hàng
   */
  async getAllOrderStatuses(
    MaDH?: string,
    TrangThai?: TrangThaiDonHang,
    page: number = 1,
    limit: number = 50
  ) {
    const skip = (page - 1) * limit;

    const { statuses, total } = await this.tinhtrangDonhangRepository.findAllOrderStatuses({
      MaDH,
      TrangThai,
      skip,
      take: limit,
    });

    return {
      statuses: statuses.map(status => this.mapToResponseDto(status)),
      total,
    };
  }

  /**
   * Lấy tình trạng đơn hàng theo ID
   */
  async getOrderStatusById(
    MaTTDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    const orderStatus = await this.tinhtrangDonhangRepository.findOrderStatusById(
      MaTTDH
    );

    if (!orderStatus) {
      throw new NotFoundException('Không tìm thấy tình trạng đơn hàng');
    }

    return this.mapToResponseDto(orderStatus);
  }

  /**
   * Lấy lịch sử trạng thái của đơn hàng
   */
  async getOrderStatusHistory(
    MaDH: string
  ): Promise<TinhtrangDonhangHistoryDto> {
    const history = await this.tinhtrangDonhangRepository.getOrderStatusHistory(
      MaDH
    );

    if (history.length === 0) {
      throw new NotFoundException('Không tìm thấy lịch sử trạng thái đơn hàng');
    }

    const currentStatus = history[history.length - 1];

    return {
      MaDH,
      history: history.map(status => this.mapToResponseDto(status)),
      total: history.length,
      currentStatus: currentStatus.TrangThai as TrangThaiDonHang,
    };
  }

  /**
   * Lấy trạng thái hiện tại của đơn hàng
   */
  async getCurrentOrderStatus(
    MaDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    const currentStatus = await this.tinhtrangDonhangRepository.getCurrentOrderStatus(
      MaDH
    );

    if (!currentStatus) {
      throw new NotFoundException('Không tìm thấy trạng thái đơn hàng');
    }

    return this.mapToResponseDto(currentStatus);
  }

  /**
   * Xóa tình trạng đơn hàng
   */
  async deleteOrderStatus(MaTTDH: string): Promise<{ message: string }> {
    const existingStatus = await this.tinhtrangDonhangRepository.findOrderStatusById(
      MaTTDH
    );

    if (!existingStatus) {
      throw new NotFoundException('Không tìm thấy tình trạng đơn hàng');
    }

    await this.tinhtrangDonhangRepository.deleteOrderStatus(MaTTDH);

    return {
      message: 'Xóa tình trạng đơn hàng thành công',
    };
  }

  /**
   * Xóa tất cả tình trạng của một đơn hàng
   */
  async deleteAllOrderStatuses(MaDH: string): Promise<{ message: string }> {
    const orderExists = await this.tinhtrangDonhangRepository.orderExists(
      MaDH
    );

    if (!orderExists) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }

    await this.tinhtrangDonhangRepository.deleteAllOrderStatuses(MaDH);

    return {
      message: 'Xóa tất cả tình trạng đơn hàng thành công',
    };
  }

  /**
   * Lấy thống kê trạng thái đơn hàng
   */
  async getOrderStatusStatistics(): Promise<TinhtrangDonhangStatsDto> {
    return await this.tinhtrangDonhangRepository.getOrderStatusStatistics();
  }

  /**
   * Validate logic chuyển trạng thái
   */
  private validateStatusTransition(
    currentStatus: TrangThaiDonHang,
    newStatus: TrangThaiDonHang
  ): void {
    // Không cho phép chuyển từ trạng thái cuối
    if (
      currentStatus === TrangThaiDonHang.DA_GIAO ||
      currentStatus === TrangThaiDonHang.HUY ||
      currentStatus === TrangThaiDonHang.XAC_NHAN_LOI
    ) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ ${currentStatus} sang ${newStatus}`
      );
    }

    // Logic chuyển trạng thái hợp lệ
    const validTransitions: Record<TrangThaiDonHang, TrangThaiDonHang[]> = {
      [TrangThaiDonHang.CHUA_GIAO]: [
        TrangThaiDonHang.DANG_GIAO,
        TrangThaiDonHang.HUY,
      ],
      [TrangThaiDonHang.DANG_GIAO]: [
        TrangThaiDonHang.DA_GIAO,
        TrangThaiDonHang.LOI,
        TrangThaiDonHang.HUY,
      ],
      [TrangThaiDonHang.LOI]: [
        TrangThaiDonHang.XAC_NHAN_LOI,
        TrangThaiDonHang.DANG_GIAO,
      ],
      [TrangThaiDonHang.DA_GIAO]: [],
      [TrangThaiDonHang.HUY]: [],
      [TrangThaiDonHang.XAC_NHAN_LOI]: [],
    };

    const allowedStatuses = validTransitions[currentStatus];

    if (!allowedStatuses.includes(newStatus)) {
      throw new BadRequestException(
        `Không thể chuyển trạng thái từ ${currentStatus} sang ${newStatus}. ` +
        `Các trạng thái hợp lệ: ${allowedStatuses.join(', ')}`
      );
    }
  }

  /**
   * Map dữ liệu từ Prisma sang DTO
   */
  private mapToResponseDto(orderStatus: any): TinhtrangDonhangResponseDto {
    return {
      MaTTDH: orderStatus.MaTTDH,
      created_at: orderStatus.created_at,
      TrangThai: orderStatus.TrangThai,
      MaDH: orderStatus.MaDH,
      DONHANG: orderStatus.DONHANG ? {
        MaDH: orderStatus.DONHANG.MaDH,
        TongTien: orderStatus.DONHANG.TongTien,
        created_at: orderStatus.DONHANG.created_at,
      } : null,
    };
  }
}
