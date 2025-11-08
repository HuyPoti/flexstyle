import { BadRequestException, Injectable } from '@nestjs/common';
import { VoucherRepository } from 'src/repositories/voucher.repository';
import { VoucherKhachHangRepository } from 'src/repositories/voucher_khachhang.repository';
import { LoaiVoucher, TrangThai } from 'src/constant';
@Injectable()
export class VoucherKhachHangService {
  constructor(
    private readonly voucherKhachHangRepository: VoucherKhachHangRepository,
    private readonly voucherRepository: VoucherRepository,
  ) {}
  //sử dụng voucher cho khách hàng
  async useVoucher(MaKH: string, MaVCKH: string) {
    return await this.voucherKhachHangRepository.useVoucher(MaKH, MaVCKH);
  }
  //xem danh sách voucher khách hàng
  async findAll(MaAuth: string) {
    //kiểm tra nếu mã voucher ở bảng voucher mà ở trạng thái INACTIVE thì chuyển các voucher đó về trạng thái INACTIVE và ngược lại
    const vouchers = await this.voucherKhachHangRepository.findAll(MaAuth);
    if (!vouchers) {
      throw new Error('Không tìm thấy voucher cho khách hàng này');
    }
    // console.log('vouchers', vouchers);
    for (const voucher of vouchers) {
      const checkVoucher = await this.voucherRepository.getVoucherById(
        voucher.MaVoucher,
      );
      if (checkVoucher) {
        // Nếu voucher tồn tại, kiểm tra trạng thái
        if (checkVoucher.TrangThai === 'INACTIVE') {
          await this.voucherKhachHangRepository.updateVoucherStatus(
            voucher.MaVoucher,
            TrangThai.INACTIVE,
          );
        }
      }
      voucher['voucherDetails'] = checkVoucher; // Gán thông tin chi tiết voucher vào đối tượng voucher khách hàng
    }
    return vouchers;
  }
  //xem chi tiết voucher khách hàng
  async findById(MaVCKH: string) {
    const voucher = await this.voucherKhachHangRepository.findById(MaVCKH);
    if (!voucher) {
      throw new Error('Không tìm thấy voucher cho khách hàng này');
    }
    const voucherDetails = await this.voucherRepository.getVoucherById(
      voucher.MaVoucher,
    );
    if (voucherDetails) {
      // Gộp thông tin chi tiết voucher vào đối tượng voucher khách hàng
      Object.assign(voucher, { voucherDetails });
    }
    return voucher;
  }
  //thêm voucher khách hàng
  async add(MaKH: string, MaVoucher: string) {
    //kiểm tra mã voucher có tồn tại trong bảng voucher không
    const checkVoucher = await this.voucherRepository.getVoucherById(MaVoucher);
    if (!checkVoucher) {
      throw new BadRequestException('Voucher không tồn tại');
    }
    //kiểm tra voucher có trong thời hạn tặng không
    if (checkVoucher.SoLuong <= 0) {
      throw new BadRequestException('Voucher đã hết số lượng');
    }
    const currentDate = new Date();
    if (
      checkVoucher.NgayBatDau > currentDate ||
      checkVoucher.NgayKetThuc < currentDate
    ) {
      throw new BadRequestException('Voucher không trong thời hạn nhận');
    }

    if (checkVoucher.TrangThai === TrangThai.INACTIVE) {
      throw new BadRequestException('Voucher không khả dụng');
    }

    //tìm kiếm voucher đã được thêm cho khách hàng chưa
    const existingVoucherForCustomer =
      await this.voucherKhachHangRepository.findVoucherForCustomer(
        MaKH, checkVoucher.MaVoucher,
      );
    if (existingVoucherForCustomer) {
      throw new BadRequestException('Bạn đã sở hữu voucher này');
    }
    //trừ đi số lượng voucher trong bảng voucher
    const decreaseAmount = await this.voucherRepository.updateVoucher(checkVoucher.MaVoucher, {
      SoLuong: checkVoucher.SoLuong - 1,
    });
    return await this.voucherKhachHangRepository.add(MaKH, checkVoucher.MaVoucher);
  }

  //kiểm tra voucher
  async check(MaVCKH: string, finalTotal: number) {
    const voucherKH = await this.voucherKhachHangRepository.findById(MaVCKH);
    if (!voucherKH) {
      throw new BadRequestException('Bạn không sở hữu voucher này');
    } 
    if (voucherKH.TrangThai === TrangThai.INACTIVE) {
      throw new BadRequestException('Voucher đã được sử dụng hoặc không khả dụng');
    }
    if (voucherKH.Hsd < new Date()) {
      throw new BadRequestException('Voucher đã hết hạn sử dụng');
    }
    const voucherDetails = await this.voucherRepository.getVoucherById(
      voucherKH.MaVoucher,
    );
    if (voucherDetails?.Loai == LoaiVoucher.GiamGia) {
      if (voucherDetails.Dieukien && voucherDetails.Dieukien > finalTotal) {
        throw new BadRequestException(`Đơn hàng chưa đạt điều kiện sử dụng voucher. Đơn tối thiểu: ${voucherDetails.Dieukien}`);
      }
      return {MaVoucher: voucherKH.MaVoucher, type: 'GiamGia', value: voucherDetails.SoTien  };
    }
    return { MaVoucher: voucherKH.MaVoucher, type: 'FreeShip', value: 0 };
  }

  //thay đổi trạng thái voucher khách hàng
  async inactiveStatus(MaVC: string, MaTK: string) {
    const voucherKH = await this.voucherKhachHangRepository.findByVoucherAndUser(MaVC, MaTK);
    console.log('voucherKH', voucherKH);
    console.log('MaVC, MaTK', MaVC, MaTK);
    if (!voucherKH) {
      throw new BadRequestException('Bạn không sở hữu voucher này');
    } 
    if (voucherKH.TrangThai === TrangThai.INACTIVE) {
      throw new BadRequestException('Voucher đã được sử dụng hoặc không khả dụng');
    }
    return await this.voucherKhachHangRepository.inactiveVoucherStatus(voucherKH.MaVCKH);
  }
}
