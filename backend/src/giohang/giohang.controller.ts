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
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GiohangService } from './giohang.service';
import { AddToCartDto, UpdateQuantityDto} from './dto/giohang.dto';
import { ResponseMessage } from 'src/decorators/response.decorator';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import { Roles } from 'src/factory_function/role';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';

@ApiTags('Giỏ hàng')
@Controller('giohang')
export class GiohangController {
  constructor(private readonly giohangService: GiohangService) {
    console.log('[GiohangController] Loaded');
  }

  @Roles('KH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Put('/update-cart')
  @ApiOperation({ summary: 'Cập nhật sản phẩm vào giỏ hàng' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm' })
  @ResponseMessage('Cập nhật sản phẩm vào giỏ hàng thành công')
  async addToCart(@Query('MaTKKH') MaTKKH: string, @Body() addToCartDto: AddToCartDto[]) {
    console.log('[GiohangController] addToCart:', addToCartDto);
    const result = await this.giohangService.updateCart(MaTKKH, addToCartDto);
    console.log('[GiohangController] addToCart result:', result);
    return result;
  }

  @Roles('KH')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get()
  @ApiOperation({ summary: 'Hiển thị tất cả sản phẩm trong giỏ hàng' })
  @ApiQuery({ name: 'MaTKKH', required: false, description: 'Mã tài khoản khách hàng' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lấy giỏ hàng thành công', 
    // type: CartResponseDto 
  })
  @ResponseMessage('Lấy giỏ hàng thành công')
  async getCartItems(@Query('MaTKKH') MaTKKH: string){
    console.log('[GiohangController] getCartItems for MaTKKH:', MaTKKH);
    const getGioHang = await this.giohangService.getCartItems(MaTKKH);
    // console.log('[GiohangController] getCartItems:', getGioHang);
    return getGioHang;
  }

  // @Put(':MaCTGH/quantity')
  // @ApiOperation({ summary: 'Thay đổi số lượng sản phẩm trong giỏ hàng' })
  // @ApiParam({ name: 'MaCTGH', description: 'Mã chi tiết giỏ hàng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'Cập nhật số lượng thành công',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Cập nhật số lượng thành công',
  //       data: {
  //         MaCTGH: 'uuid',
  //         SoLuong: 3,
  //         CHITIETSANPHAM: {
  //           TenSP: 'Áo thun nam',
  //           GiaBan: 200000
  //         }
  //       }
  //     }
  //   }
  // })
  // @ApiResponse({ status: 400, description: 'Không đủ hàng trong kho' })
  // @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm trong giỏ hàng' })
  // @ResponseMessage('Cập nhật số lượng thành công')
  // async updateQuantity(
  //   @Param('MaCTGH') MaCTGH: string,
  //   @Body() updateQuantityDto: UpdateQuantityDto,
  // ) {
  //   return await this.giohangService.updateQuantity(MaCTGH, updateQuantityDto);
  // }

  // @Delete(':MaCTGH')
  // @ApiOperation({ summary: 'Xóa sản phẩm ra khỏi giỏ hàng' })
  // @ApiParam({ name: 'MaCTGH', description: 'Mã chi tiết giỏ hàng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'Xóa sản phẩm thành công',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Đã xóa sản phẩm khỏi giỏ hàng',
  //       data: { message: 'Đã xóa sản phẩm khỏi giỏ hàng' }
  //     }
  //   }
  // })
  // @ApiResponse({ status: 404, description: 'Không tìm thấy sản phẩm trong giỏ hàng' })
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage('Đã xóa sản phẩm khỏi giỏ hàng')
  // async removeFromCart(@Param('MaCTGH') MaCTGH: string) {
  //   return await this.giohangService.removeFromCart(MaCTGH);
  // }

  // @Get('checkout')
  // @ApiOperation({ summary: 'Lấy sản phẩm để mua (chuẩn bị thanh toán)' })
  // @ApiQuery({ name: 'MaTKKH', required: false, description: 'Mã tài khoản khách hàng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'Lấy danh sách sản phẩm để mua thành công',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Sản phẩm sẵn sàng để mua',
  //       data: {
  //         MaGH: 'cart-uuid',
  //         totalQuantity: 5,
  //         totalValue: 1500000,
  //         readyForPurchase: true,
  //         items: []
  //       }
  //     }
  //   }
  // })
  // @ApiResponse({ status: 400, description: 'Giỏ hàng trống hoặc sản phẩm không đủ hàng' })
  // @ResponseMessage('Sản phẩm sẵn sàng để mua')
  // async getItemsForPurchase(@Query('MaTKKH') MaTKKH: string) {
  //   return await this.giohangService.getItemsForPurchase(MaTKKH);
  // }

  // @Delete()
  // @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng' })
  // @ApiQuery({ name: 'MaTKKH', required: false, description: 'Mã tài khoản khách hàng' })
  // @ApiResponse({ 
  //   status: 200, 
  //   description: 'Xóa toàn bộ giỏ hàng thành công',
  //   schema: {
  //     example: {
  //       success: true,
  //       message: 'Đã xóa toàn bộ giỏ hàng',
  //       data: { message: 'Đã xóa toàn bộ giỏ hàng' }
  //     }
  //   }
  // })
  // @HttpCode(HttpStatus.OK)
  // @ResponseMessage('Đã xóa toàn bộ giỏ hàng')
  // async clearCart(@Query('MaTKKH') MaTKKH: string) {
  //   return await this.giohangService.clearCart(MaTKKH);
  // }

  //tạo giỏ hàng
  
  @Post('create-cart')
  @ApiOperation({ summary: 'Tạo giỏ hàng cho khách hàng' })
  @ApiQuery({ name: 'MaTKKH', required: false, description: 'Mã tài khoản khách hàng' })
  async createCart(@Query('MaTKKH') MaTKKH: string){
    return await this.giohangService.createCart(MaTKKH);
  }
}