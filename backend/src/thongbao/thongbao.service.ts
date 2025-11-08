import { BadRequestException, Injectable } from '@nestjs/common';
import { ThongbaoRepository } from 'src/repositories/thongbao.repository';
import { ThongBaoDto } from './dto/thongbao.dto';
import { LoaiTB } from 'src/constant';

@Injectable()
export class ThongbaoService {
    constructor(private readonly thongbaoRepository: ThongbaoRepository) {}

    async getAllSuKienUuDai() {
        return this.thongbaoRepository.findAllSK();
    }

    async getAllVoucher() {
        const data = await this.thongbaoRepository.findAllVC();
        return data;
    }

    async updateThongBaoSK(thongbao: ThongBaoDto[]) {
        for (const tb of thongbao) {
            if (tb.MaTB == "") {
                const create = this.thongbaoRepository.createThongBao(tb.Loai, tb.MaSK, undefined);
                if (!create){
                    throw new BadRequestException('Tạo thông báo thất bại');
                }
            }
        }
        const existingTBs = await this.thongbaoRepository.findAllSK();
        const tbToDelete = existingTBs.filter(
            (existingTB) =>
                !thongbao.some(
                    (tb) => tb.MaTB === existingTB.MaTB
                )
        );
        for (const tb of tbToDelete) {
            const deleteTB = await this.thongbaoRepository.deleteById(tb.MaTB);
            if (!deleteTB) {
                throw new BadRequestException('Xóa thông báo thất bại');
            }
        }
    }

    async updateThongBaoVC(thongbao: ThongBaoDto[]) {
        for (const tb of thongbao) {
            if (tb.MaTB == "") {
                const create = this.thongbaoRepository.createThongBao(tb.Loai, undefined, tb.MaVoucher);
                if (!create){
                    throw new BadRequestException('Tạo thông báo thất bại');
                }
            }
        }
        const existingTBs = await this.thongbaoRepository.findAllVC();
        const tbToDelete = existingTBs.filter(
            (existingTB) =>
                !thongbao.some(
                    (tb) => tb.MaTB === existingTB.MaTB
                )
        );
        for (const tb of tbToDelete) {
            const deleteTB = await this.thongbaoRepository.deleteById(tb.MaTB);
            if (!deleteTB) {
                throw new BadRequestException('Xóa thông báo thất bại');
            }
        }
    }
    async deleteThongBaoVC() {
        // Logic xóa thông báo voucher
        // Ví dụ: Xóa tất cả thông báo có Loại là VOUCHER
        const existingTBs = await this.thongbaoRepository.findAllVC();
        if (existingTBs.length === 0) {
            return;
        }
        const result = await this.thongbaoRepository.deleteByLoai(LoaiTB.VOUCHER);
        if (!result) {
            throw new BadRequestException('Xóa thông báo thất bại');
        }
    }
    async deleteThongBaoSK() {
        // Logic xóa thông báo sự kiện
        // Ví dụ: Xóa tất cả thông báo có Loại là SUKIENUUDAI
        const existingTBs = await this.thongbaoRepository.findAllVC();
        if (existingTBs.length === 0) {
            return;
        }
        const result = await this.thongbaoRepository.deleteByLoai(LoaiTB.SUKIENUUDAI);
        if (!result) {
            throw new BadRequestException('Xóa thông báo thất bại');
        }
    }
}
