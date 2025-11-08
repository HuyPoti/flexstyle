import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GiohangRepository } from 'src/repositories/giohang.repository';
import {
  AddToCartDto,
  UpdateQuantityDto,
} from './dto/giohang.dto';

@Injectable()
export class GiohangService {
  constructor(
    private prisma: PrismaService,
    private giohangRepository: GiohangRepository,
  ) {}

  //tạo giỏ hàng
  async createCart(MaTKKH: string) {
    const cart = await this.giohangRepository.createCart({ MaTKKH });
    return cart;
  }
  // Lấy hoặc tạo giỏ hàng cho user
  private async getCart(MaTKKH: string) {
    let cart = await this.giohangRepository.findCartByUserId(MaTKKH);
    // console.log('cart', cart);
    if (!cart) {
      throw new BadRequestException('Không tìm thấy giỏ hàng cho người dùng này');
    }
    return cart;
  }

  // Cập nhật sản phẩm vào giỏ hàng
  async updateCart(MaTKKH: string, addToCartDto: AddToCartDto[]) {
    const cart = await this.getCart(MaTKKH);
    if (!cart) {
      throw new NotFoundException('Không tìm thấy giỏ hàng cho người dùng này');
    }
    if (!addToCartDto || addToCartDto.length === 0) {
      const result = await this.clearCart(MaTKKH);
      if (!result){
        throw new Error('Xóa giỏ hàng thất bại');
      }
      return result;
    }
    for (const item of addToCartDto) {
      const { MaCTSP, SoLuong } = item;
      const chiTietSanPham = await this.prisma.cHITIETSANPHAM.findFirst({
        where: { MaCTSP },
      });
      console.log('chiTietSanPham', chiTietSanPham);
      if (!chiTietSanPham) {
        throw new NotFoundException('Không tìm thấy chi tiết sản phẩm');
      }
      // Kiểm tra số lượng tồn kho của các sản phẩm
      if (!SoLuong) {
        throw new BadRequestException('Số lượng là bắt buộc');
      }
      if (chiTietSanPham.SoLuong < SoLuong) {
        throw new BadRequestException(
          `Không đủ hàng trong kho. Chỉ còn ${chiTietSanPham.SoLuong} sản phẩm`,
        );
      }
      //kiểm tra sản phẩm đã có trong giỏ hàng chưa
      if (!MaCTSP){
        throw new BadRequestException('Mã chi tiết sản phẩm là bắt buộc');
      }
      const existingCartItem =
        await this.giohangRepository.findCartItemByProductDetail(
          cart.MaGH,
          MaCTSP,
        );

      if (existingCartItem) {
        // Cập nhật số lượng
        const updatedCartItem = await this.giohangRepository.updateCartItemQuantity(
          existingCartItem.MaCTGH,
          SoLuong,
        );
        console.log('Updated Cart Item:', updatedCartItem);
      } else {
        // Thêm sản phẩm mới vào giỏ
        if (!MaCTSP) {
          throw new BadRequestException('Mã chi tiết sản phẩm là bắt buộc');
        }
        const newCartItem = await this.giohangRepository.createCartItem({
          MaGH: cart.MaGH,
          MaCTSP,
          SoLuong,
        });
        console.log('New Cart Item:', newCartItem);
      }
    }
    const rowCartItems = await this.giohangRepository.findAllCartItems(
      cart.MaGH,
    );
    for (const item of rowCartItems) {
      if (!addToCartDto.find(i => i.MaCTSP === item.CHITIETSANPHAM.MaCTSP)) {
        await this.giohangRepository.deleteCartItem(item.MaCTGH);
      } 
    }
    return { message: 'Cập nhật giỏ hàng thành công' };
  }

  // Lấy tất cả sản phẩm trong giỏ hàng
  async getCartItems(MaTKKH: string){
    const cart = await this.getCart(MaTKKH);
    const rawCartItems = await this.giohangRepository.findAllCartItems(
      cart.MaGH,
    );
    const cartItems = rawCartItems.map((item) => ({
      productId: item.CHITIETSANPHAM.MaCTSP,
      name: item.CHITIETSANPHAM.SANPHAM.TenSP,
      price: item.CHITIETSANPHAM.SANPHAM.GiaBan,
      quantity: item.SoLuong,
      size: item.CHITIETSANPHAM.KichCo,
      color: item.CHITIETSANPHAM.SANPHAM.MauSac,
      image: item.CHITIETSANPHAM.SANPHAM.HinhAnh[0],
    }));

    return cartItems;
  }

  // // Cập nhật số lượng sản phẩm trong giỏ
  // async updateQuantity(MaCTGH: string, updateQuantityDto: UpdateQuantityDto) {
  //   const { SoLuong } = updateQuantityDto;

  //   const cartItem = await this.giohangRepository.findCartItemById(MaCTGH);

  //   if (!cartItem) {
  //     throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
  //   }

  //   // Kiểm tra số lượng tồn kho
  //   if (cartItem.CHITIETSANPHAM.SoLuong < SoLuong) {
  //     throw new BadRequestException(
  //       `Không đủ hàng trong kho. Chỉ còn ${cartItem.CHITIETSANPHAM.SoLuong} sản phẩm`,
  //     );
  //   }

  //   return await this.giohangRepository.updateCartItemQuantity(MaCTGH, SoLuong);
  // }

  // // Xóa sản phẩm khỏi giỏ hàng
  // async removeFromCart(MaCTGH: string) {
  //   const cartItem = await this.giohangRepository.findCartItemById(MaCTGH);

  //   if (!cartItem) {
  //     throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ hàng');
  //   }

  //   await this.giohangRepository.deleteCartItem(MaCTGH);

  //   return { message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
  // }

  // // Lấy sản phẩm để chuẩn bị mua (checkout)
  // async getItemsForPurchase(MaTKKH: string) {
  //   const cartData = await this.getCartItems(MaTKKH);

  //   if (cartData.items.length === 0) {
  //     throw new BadRequestException('Giỏ hàng trống');
  //   }

  //   // Kiểm tra tồn kho cho tất cả sản phẩm
  //   const validation = await this.giohangRepository.validateStockForCheckout(
  //     cartData.MaGH,
  //   );

  //   if (!validation.isValid) {
  //     const outOfStockNames = validation.outOfStockItems
  //       .map((item) => item.TenSP)
  //       .join(', ');
  //     throw new BadRequestException(
  //       `Các sản phẩm sau không đủ hàng: ${outOfStockNames}`,
  //     );
  //   }

  //   return {
  //     ...cartData,
  //     readyForPurchase: true,
  //     message: 'Tất cả sản phẩm sẵn sàng để mua',
  //   };
  // }

  // Xóa toàn bộ giỏ hàng
  async clearCart(MaTKKH: string) {
    const cart = await this.getCart(MaTKKH);

    await this.giohangRepository.deleteAllCartItems(cart.MaGH);

    return { message: 'Đã xóa toàn bộ giỏ hàng' };
  }
}
