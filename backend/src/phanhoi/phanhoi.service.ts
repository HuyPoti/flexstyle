import { Injectable } from '@nestjs/common';
import { PhanHoiRepository } from 'src/repositories/phanhoi.repository';
import { PhanHoiDto } from './dto/phanhoi.dto';
import { SanPhamRepository } from 'src/repositories/sanpham.repository';
import { PhanHoiMapper } from './entity/phanhoi.mapper';
@Injectable()
export class PhanHoiService {
  constructor(
    private readonly phanHoiRepository: PhanHoiRepository,
    private readonly sanPhamRepository: SanPhamRepository,
  ) {}
  //lấy danh sách phản hồi theo sản phẩm
  async findAll(slug: string) {
    const exsitingSanPham = await this.sanPhamRepository.findSPBySlug(slug);
    if (!exsitingSanPham) {
      throw new Error('Sản phẩm không tồn tại');
    }
    const feedbacks = await this.phanHoiRepository.findAll(
      exsitingSanPham.MaSP,
    );
    const feedbacksCustomer = await this.phanHoiRepository.findAllCustomer(
      feedbacks.map((fb) => fb.MaTKKH),
    );
    if (!feedbacks && !feedbacksCustomer) {
      throw new Error('Không tìm thấy phản hồi cho sản phẩm này');
    }
    return { feedbacks, feedbacksCustomer };
  }
  //xem chi tiết phản hồi
  async findById(MaPH: string) {
    const exsitingPhanHoi = await this.phanHoiRepository.findById(MaPH);
    if (!exsitingPhanHoi) {
      throw new Error('Phản hồi không tồn tại');
    }
    return exsitingPhanHoi;
  }
  //chỉnh sửa phản hồi
  async update(MaPH: string, MaTKKH: string, updateData: PhanHoiDto) {
    const exsitingPhanHoi = await this.phanHoiRepository.findById(MaPH);
    if (!exsitingPhanHoi) {
      throw new Error('Phản hồi không tồn tại');
    }
    return await this.phanHoiRepository.update(MaPH, MaTKKH, updateData);
  }
  //lấy phản hồi của khách hàng theo sản phẩm
  async getCustomerFeedback(MaSP: string, MaTKKH: string) {
    const exsitingSanPham = await this.sanPhamRepository.findSPByID(MaSP);
    if (!exsitingSanPham) {
      throw new Error('Sản phẩm không tồn tại');
    }
    return await this.phanHoiRepository.getCustomerFeedback(MaSP, MaTKKH);
  }

  //lấy phản hồi của khách hàng theo sản phẩm cho nhân viên
  async getCustomerFeedbackForNV() {
    return await this.phanHoiRepository.getCustomerFeedbackForNV();
  }
  //xóa phản hồi
  async delete(MaPH: string) {
    console.log("MaPH in service:", MaPH);
    const exsitingPhanHoi = await this.phanHoiRepository.findById(MaPH);
    if (!exsitingPhanHoi) {
      throw new Error('Phản hồi không tồn tại');
    }
    return await this.phanHoiRepository.delete(MaPH);
  }
}
