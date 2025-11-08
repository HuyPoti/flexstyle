import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TinhtrangDonhangService } from './tinhtrangdonhang.service';
import {
  CreateTinhtrangDonhangDto,
  UpdateTinhtrangDonhangDto,
  TinhtrangDonhangResponseDto,
  TinhtrangDonhangHistoryDto,
  TinhtrangDonhangStatsDto,
  TrangThaiDonHang,
} from './dto/tinhtrangdonhang.dto';
import { ResponseMessage } from 'src/decorators/response.decorator';

@ApiTags('Tình trạng đơn hàng')
@Controller('tinhtrangdonhang')
export class TinhtrangDonhangController {
  constructor(
    private readonly tinhtrangDonhangService: TinhtrangDonhangService
  ) {
    console.log('[TinhtrangDonhangController] Loaded');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo tình trạng đơn hàng mới' })
  @ApiBody({ type: CreateTinhtrangDonhangDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo tình trạng đơn hàng thành công',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @ResponseMessage('Tạo tình trạng đơn hàng thành công')
  async createOrderStatus(
    @Body() createDto: CreateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.createOrderStatus(createDto);
  }

  @Put('order/:MaDH')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  @ApiParam({
    name: 'MaDH',
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiBody({ type: UpdateTinhtrangDonhangDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái đơn hàng thành công',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể chuyển trạng thái',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @ResponseMessage('Cập nhật trạng thái đơn hàng thành công')
  async updateOrderStatus(
    @Param('MaDH') MaDH: string,
    @Body() updateDto: UpdateTinhtrangDonhangDto
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.updateOrderStatus(
      MaDH,
      updateDto
    );
  }

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả tình trạng đơn hàng' })
  @ApiQuery({
    name: 'MaDH',
    required: false,
    description: 'Lọc theo mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiQuery({
    name: 'TrangThai',
    required: false,
    enum: TrangThaiDonHang,
    description: 'Lọc theo trạng thái',
    example: TrangThaiDonHang.DANG_GIAO,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Số trang',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Số lượng mỗi trang',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách tình trạng đơn hàng thành công',
  })
  @ResponseMessage('Lấy danh sách tình trạng đơn hàng thành công')
  async getAllOrderStatuses(
    @Query('MaDH') MaDH?: string,
    @Query('TrangThai') TrangThai?: TrangThaiDonHang,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number
  ) {
    return await this.tinhtrangDonhangService.getAllOrderStatuses(
      MaDH,
      TrangThai,
      page,
      limit
    );
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Lấy thống kê trạng thái đơn hàng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công',
    type: TinhtrangDonhangStatsDto,
  })
  @ResponseMessage('Lấy thống kê trạng thái đơn hàng thành công')
  async getOrderStatusStatistics(): Promise<TinhtrangDonhangStatsDto> {
    return await this.tinhtrangDonhangService.getOrderStatusStatistics();
  }

  @Get('history/:MaDH')
  @ApiOperation({ summary: 'Lấy lịch sử trạng thái của đơn hàng' })
  @ApiParam({
    name: 'MaDH',
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy lịch sử trạng thái thành công',
    type: TinhtrangDonhangHistoryDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch sử trạng thái' })
  @ResponseMessage('Lấy lịch sử trạng thái đơn hàng thành công')
  async getOrderStatusHistory(
    @Param('MaDH') MaDH: string
  ): Promise<TinhtrangDonhangHistoryDto> {
    return await this.tinhtrangDonhangService.getOrderStatusHistory(MaDH);
  }

  @Get('current/:MaDH')
  @ApiOperation({ summary: 'Lấy trạng thái hiện tại của đơn hàng' })
  @ApiParam({
    name: 'MaDH',
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy trạng thái hiện tại thành công',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy trạng thái' })
  @ResponseMessage('Lấy trạng thái hiện tại thành công')
  async getCurrentOrderStatus(
    @Param('MaDH') MaDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.getCurrentOrderStatus(MaDH);
  }

  @Get(':MaTTDH')
  @ApiOperation({ summary: 'Lấy tình trạng đơn hàng theo ID' })
  @ApiParam({
    name: 'MaTTDH',
    description: 'Mã tình trạng đơn hàng',
    example: 'uuid-ttdh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy tình trạng đơn hàng thành công',
    type: TinhtrangDonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tình trạng đơn hàng' })
  @ResponseMessage('Lấy tình trạng đơn hàng thành công')
  async getOrderStatusById(
    @Param('MaTTDH') MaTTDH: string
  ): Promise<TinhtrangDonhangResponseDto> {
    return await this.tinhtrangDonhangService.getOrderStatusById(MaTTDH);
  }

  @Delete(':MaTTDH')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa tình trạng đơn hàng' })
  @ApiParam({
    name: 'MaTTDH',
    description: 'Mã tình trạng đơn hàng',
    example: 'uuid-ttdh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa tình trạng đơn hàng thành công',
    schema: {
      example: {
        success: true,
        message: 'Xóa tình trạng đơn hàng thành công',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tình trạng đơn hàng' })
  @ResponseMessage('Xóa tình trạng đơn hàng thành công')
  async deleteOrderStatus(
    @Param('MaTTDH') MaTTDH: string
  ): Promise<{ message: string }> {
    return await this.tinhtrangDonhangService.deleteOrderStatus(MaTTDH);
  }

  @Delete('order/:MaDH/all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa tất cả tình trạng của một đơn hàng' })
  @ApiParam({
    name: 'MaDH',
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Xóa tất cả tình trạng đơn hàng thành công',
    schema: {
      example: {
        success: true,
        message: 'Xóa tất cả tình trạng đơn hàng thành công',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @ResponseMessage('Xóa tất cả tình trạng đơn hàng thành công')
  async deleteAllOrderStatuses(
    @Param('MaDH') MaDH: string
  ): Promise<{ message: string }> {
    return await this.tinhtrangDonhangService.deleteAllOrderStatuses(MaDH);
  }
}
