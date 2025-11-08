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
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { DonhangService } from './donhang.service';
import { CreateDonhangDto, CreateDonhangStatusDto, UpdateDonhangStatusDto } from './dto/donhang.dto';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { Roles } from 'src/factory_function/role';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';

@ApiTags('Đơn hàng')
@Controller('donhang')
export class DonhangController {
  constructor(private readonly donhangService: DonhangService) {
    console.log('[DonhangController] Loaded');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  @ApiBody({ type: CreateDonhangDto })
  @ApiResponse({
    status: 201,
    description: 'Tạo đơn hàng thành công',
    // type: DonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ hoặc không đủ hàng trong kho',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @ResponseMessage('Tạo đơn hàng thành công')
  async createOrder(@Body() createDto: CreateDonhangDto) {
    console.log('Creating order with data:', createDto);
    return await this.donhangService.createOrder(createDto);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Lấy danh sách tất cả đơn hàng' })
  @ApiQuery({
    name: 'MaTK_KH',
    required: false,
    description: 'Mã tài khoản khách hàng để lọc đơn hàng',
    example: 'uuid-tk-123',
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
    description: 'Số lượng đơn hàng mỗi trang',
    example: 50,
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách đơn hàng thành công',
    // type: DonhangListResponseDto,
  })
  @ResponseMessage('Lấy danh sách đơn hàng thành công')
  async getAllOrders(
    @Query('MaTK_KH') MaTK_KH?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return await this.donhangService.getAllOrders(MaTK_KH, page, limit);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Lấy tổng hợp thông tin đơn hàng' })
  @ApiQuery({
    name: 'MaTK_KH',
    required: false,
    description: 'Mã tài khoản khách hàng',
    example: 'uuid-tk-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy tổng hợp đơn hàng thành công',
    schema: {
      example: {
        success: true,
        message: 'Lấy tổng hợp đơn hàng thành công',
        data: {
          totalOrders: 150,
          processingOrders: 20,
          shippingOrders: 30,
          completedOrders: 90,
          cancelledOrders: 10,
          totalRevenue: 45000000,
        },
      },
    },
  })
  @ResponseMessage('Lấy tổng hợp đơn hàng thành công')
  async getOrderSummary(@Query('MaTK_KH') MaTK_KH?: string) {
    return await this.donhangService.getOrderSummary(MaTK_KH);
  }

  //Lấy tất cả đơn hàng
  // @Roles('NVCSKH')
  // @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('/allOrders')
  @ResponseMessage('Lấy tất cả đơn hàng thành công')
  async getAllDonhangs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    console.log('Get all donhangs called with page:', page, 'limit:', limit);
    const donhangs = await this.donhangService.getAllOrderForStaff(page, limit);
    return donhangs;
  }

  @Put(':MaDH/status')
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  @ApiParam({
    name: 'MaDH',
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiBody({ type: UpdateDonhangStatusDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật trạng thái đơn hàng thành công',
    // type: DonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể cập nhật trạng thái cho đơn hàng này',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @ResponseMessage('Cập nhật trạng thái đơn hàng thành công')
  async updateOrderStatus(
    @Param('MaDH') MaDH: string,
    @Body() updateDto: UpdateDonhangStatusDto,
  ) {
    return await this.donhangService.updateOrderStatus(MaDH, updateDto);
  }

  @Put(':MaDH/cancel')
  @ApiOperation({ summary: 'Hủy đơn hàng' })
  @ApiParam({
    name: 'MaDH',
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Hủy đơn hàng thành công',
    // type: DonhangResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Không thể hủy đơn hàng đã hoàn tất',
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @ResponseMessage('Hủy đơn hàng thành công')
  async cancelOrder(@Param('MaDH') MaDH: string) {
    return await this.donhangService.cancelOrder(MaDH);
  }
  @Get(':MaDH')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng theo ID' })
  @ApiParam({
    name: 'MaDH',
    description: 'Mã đơn hàng',
    example: 'uuid-dh-123',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy chi tiết đơn hàng thành công',
    // type: DonhangResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  @ResponseMessage('Lấy chi tiết đơn hàng thành công')
  async getOrderById(@Param('MaDH') MaDH: string) {
    return await this.donhangService.getOrderById(MaDH);
  }

  // @Delete(':MaDH')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Xóa đơn hàng hoàn toàn' })
  // @ApiParam({
  //   name: 'MaDH',
  //   description: 'Mã đơn hàng',
  //   example: 'uuid-dh-123',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Xóa đơn hàng thành công',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Xóa đơn hàng thành công',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'Chỉ có thể xóa đơn hàng đã hoàn tất hoặc đã hủy',
  // })
  // @ApiResponse({ status: 404, description: 'Không tìm thấy đơn hàng' })
  // @ResponseMessage('Xóa đơn hàng thành công')
  // async deleteOrder(
  //   @Param('MaDH') MaDH: string
  // ): Promise<{ message: string }> {
  //   return await this.donhangService.deleteOrder(MaDH);
  // }

  //thêm tình trạng đơn hàng
  @Roles('NVCSKH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Post("/status/add")
  async addOrderStatus(@Body() body: CreateDonhangStatusDto) {
    return await this.donhangService.addOrderStatus(body);
  }
}
