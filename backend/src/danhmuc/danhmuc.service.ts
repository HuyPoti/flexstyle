import { BadRequestException, Injectable } from '@nestjs/common';
import { TrangThai, LoaiDanhMuc } from 'src/constant';
import { DanhMucDto } from './dto/danhmuc.dto';
import { DanhMucRepository } from 'src/repositories/danhmuc.repository';
import { ExcelService } from './excel.service';
@Injectable()
export class DanhMucService {
    constructor(
        private readonly danhMucRepository: DanhMucRepository,
        private readonly excelService: ExcelService,
    ) {}

    async getAllDanhMuc() {
        return this.danhMucRepository.findAll();
    }
    async getDanhMucById(id: string) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh mục không tồn tại');
        }
        return existingDanhMuc;
    }
    async addDanhMuc(data: DanhMucDto) {
        const existingDanhMuc = await this.danhMucRepository.findByName(data.TenDM);
        if (existingDanhMuc) {
            throw new BadRequestException('Danh mục đã tồn tại');
        }
        return this.danhMucRepository.createDanhMuc(data);
    }
    async updateDanhMuc(id: string, data: DanhMucDto) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh mục không tồn tại');
        }
        if (data.TenDM && data.TenDM !== existingDanhMuc.TenDM) {
            const danhMucWithSameName = await this.danhMucRepository.findByName(data.TenDM);
            if (danhMucWithSameName) {
                throw new BadRequestException('Tên danh mục đã tồn tại');
            }
        }   
        return this.danhMucRepository.updateDanhMuc(id, data);
    }
    async changeTrangThai(id: string, trangThai: string) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh mục không tồn tại');
        }
        if (!(trangThai in TrangThai)) {
            throw new BadRequestException('Trạng thái không hợp lệ');
        }
        return this.danhMucRepository.changeTrangThai(id, trangThai as TrangThai);
    }
    async changeLoai(id: string, Loai: string) {
        const existingDanhMuc = await this.danhMucRepository.findById(id);
        if (!existingDanhMuc) {
            throw new BadRequestException('Danh mục không tồn tại');
        }
        if (!(Loai in LoaiDanhMuc)) {
            throw new BadRequestException('Loại danh mục không hợp lệ');
        }
        const updatedDanhMuc = await this.danhMucRepository.changeLoai(id, Loai as LoaiDanhMuc);
        if (!updatedDanhMuc) {
            throw new BadRequestException('Cập nhật loại danh mục thất bại');
        }
        return updatedDanhMuc;
    }
    async exportDanhMucToExcel() : Promise<Buffer> {
        //lấy tên nhân viên đăng nhập từ token
        const currentUser = { id: 1, name: 'Admin' }; // giả lập thông tin người dùng
        const danhMucList = await this.danhMucRepository.findAll();
        return this.excelService.generateToExcel(danhMucList, currentUser.name);
    }
}