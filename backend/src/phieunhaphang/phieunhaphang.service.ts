import { Injectable } from '@nestjs/common';
import { PhieuNhapHangDto } from './dto/phieunhaphang.dto';
import { PhieuNhapHangRepository } from 'src/repositories/phieunhaphang.repository';
import { TrangThaiPhieuNhapHang } from '@prisma/client';
@Injectable()
export class PhieuNhapHangService {
  constructor(
    private readonly phieuNhapHangRepository: PhieuNhapHangRepository,
  ) {}
  //lấy tất cả phiếu nhập hàng
  async findAll() {
    return this.phieuNhapHangRepository.findAll();
  }
  //lấy phiếu nhập hàng theo id
  async findById(id: string) {
    const phieuNhapHang = await this.phieuNhapHangRepository.findById(id);
    if (!phieuNhapHang) {
      throw new Error('Phiếu nhập hàng không tồn tại');
    }
    return phieuNhapHang;
  }
  async findByIdNcc(id: string) {
    const phieuNhapHang = await this.phieuNhapHangRepository.findByIdNcc(id);
    console.log('Service - findByIdNcc result:', phieuNhapHang);
    if (!phieuNhapHang) {
      throw new Error('Không tồn tại');
    }
    return phieuNhapHang;
  }
  //tạo phiếu nhập hàng
  async create(data: PhieuNhapHangDto) {
    return this.phieuNhapHangRepository.create(data);
  }
  //cập nhật phiếu nhập hàng
  async update(id: string, data: PhieuNhapHangDto) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiếu nhập hàng không tồn tại');
    }
    return this.phieuNhapHangRepository.update(id, data);
  }
  //Nhân viên xác nhận phiếu nhập hàng
  async nhanVienXacNhan(id: string, MaTKNVXN: string, TrangThai: string) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiếu nhập hàng không tồn tại');
    }
    if (!(TrangThai in TrangThaiPhieuNhapHang)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    if (existingPhieuNhapHang.TrangThai !== 'NCC_XACNHAN') {
      throw new Error(
        'Phiếu nhập hàng phải ở trạng thái nhà cung cấp xác nhận thì nhân viên mới có thể xác nhận',
      );
    }
    return this.phieuNhapHangRepository.nhanVienXacNhan(
      id,
      MaTKNVXN,
      TrangThai as TrangThaiPhieuNhapHang,
    );
  }
  //Nhà cung cấp xác nhận phiếu nhập hàng
  async nhaCungCapXacNhan(id: string, TrangThai: string) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiếu nhập hàng không tồn tại');
    }
    if (!(TrangThai in TrangThaiPhieuNhapHang)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    if (existingPhieuNhapHang.TrangThai !== 'DANG_CHO') {
      throw new Error(
        'Phiếu nhập hàng phải ở trạng thái đang chờ thì nhà cung cấp mới có thể xác nhận',
      );
    }

    return this.phieuNhapHangRepository.nhaCungCapXacNhan(
      id,
      TrangThai as TrangThaiPhieuNhapHang,
    );
  }
  //Nhà cung cấp từ chối phiếu nhập hàng
  async nhaCungCapTuChoi(id: string, TrangThai: string) {
    const existingPhieuNhapHang =
      await this.phieuNhapHangRepository.findById(id);
    if (!existingPhieuNhapHang) {
      throw new Error('Phiếu nhập hàng không tồn tại');
    }
    if (!(TrangThai in TrangThaiPhieuNhapHang)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    if (existingPhieuNhapHang.TrangThai !== 'DANG_CHO') {
      throw new Error(
        'Phiếu nhập hàng phải ở trạng thái đang chờ thì nhà cung cấp mới có thể từ chối',
      );
    }
    return this.phieuNhapHangRepository.nhaCungCapTuChoi(
      id,
      TrangThai as TrangThaiPhieuNhapHang,
    );
  }

  //lấy phiếu nhập hàng phân trang
  async findPaged(params: {
    page: number;
    pageSize: number;
    status?: TrangThaiPhieuNhapHang;
    date?: string;
  }) {
    return this.phieuNhapHangRepository.findPaged(params);
  }
}
