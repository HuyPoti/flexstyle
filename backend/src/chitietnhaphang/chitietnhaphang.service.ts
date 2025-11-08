import { Injectable } from '@nestjs/common';
import { ChitietnhaphangRepository } from 'src/repositories/chitietnhaphang.repository';

export type CreateCtNhapItem = { MaCTSP: string; SoLuong: number; DonGia: number };

@Injectable()
export class ChitietnhaphangService {
  constructor(private readonly repo: ChitietnhaphangRepository) {}
  // lấy chi tiết nhập hàng theo mã phiếu
  async findByPhieu(MaPNH: string) {
    return this.repo.findByMaPNH(MaPNH);
  }
  // Tạo chi tiết nhập hàng cho phiếu
  async createForPhieu(MaPNH: string, items: CreateCtNhapItem[]) {
    return this.repo.createForPhieu(MaPNH, items as any);
  }
  // danh sách các biến thể sản phẩm
  async listVariants() {
    return this.repo.listVariants();
  }
  // tìm kiếm biến thể sản phẩm theo từ khóa
  async searchVariants(q: string) {
    return this.repo.searchVariants(q);
  }
  // lấy biến thể sản phẩm theo mã
  async getVariant(MaCTSP: string) {
    return this.repo.findVariantByMaCTSP(MaCTSP);
  }
}
