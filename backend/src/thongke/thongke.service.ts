import { Injectable } from '@nestjs/common';
import { ThongkeRepository } from 'src/repositories/thongke.repository';

@Injectable()
export class ThongkeService {
    constructor(private readonly thongkeRepository: ThongkeRepository) { }

    async getDoanhThu() {
        return await this.thongkeRepository.getDoanhThu();
    }

    async getSLKhachHang() {
        return await this.thongkeRepository.getSLKhachHang();
    }
}
