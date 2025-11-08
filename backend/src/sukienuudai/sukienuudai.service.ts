import { BadRequestException, Injectable } from '@nestjs/common';
import { SuKienUuDaiDto } from './dto/sukienuudai.dto';
import { SuKienUuDaiRepository } from 'src/repositories/sukienuudai.repository';
import { TrangThai } from 'src/constant';
@Injectable()
export class SuKienUuDaiService {
  constructor(private readonly suKienUuDaiRepository: SuKienUuDaiRepository) {}

  async getAll() {
    const sukienuudais = await this.suKienUuDaiRepository.findAll();
    if (!sukienuudais) {
      return sukienuudais;
    }
    for (const sukienuudai of sukienuudais) {
      if (sukienuudai.NgayKT < new Date()) {
        await this.suKienUuDaiRepository.changeTrangThai(
          sukienuudai.MaSK,
          TrangThai.INACTIVE,
        );
      }
    }
    return sukienuudais;
  }

  async getById(id: string) {
    const existingSuKienUuDai =
      await this.suKienUuDaiRepository.findById(id);
    if (!existingSuKienUuDai) {
      throw new BadRequestException('Sự kiện ưu đãi không tồn tại');
    }
    return existingSuKienUuDai;
  }

  async addSuKienUuDai(suKienUuDaiDto: SuKienUuDaiDto) {
    const existingSuKienUuDai = await this.suKienUuDaiRepository.findByName(
      suKienUuDaiDto.TenSK,
    );
    if (existingSuKienUuDai) {
      throw new BadRequestException('Sự kiện ưu đãi đã tồn tại');
    }
    return await this.suKienUuDaiRepository.add(suKienUuDaiDto);
  }

  async updateSuKienUuDai(id: string, data: SuKienUuDaiDto) {
    const existingSuKienUuDai = await this.suKienUuDaiRepository.findById(id);
    if (!existingSuKienUuDai) {
      throw new BadRequestException('Sự kiện ưu đãi không tồn tại');
    }
    if (data.TenSK && data.TenSK !== existingSuKienUuDai.TenSK) {
      const suKienUuDaiWithSameName =
        await this.suKienUuDaiRepository.findByName(data.TenSK);
      if (suKienUuDaiWithSameName) {
        throw new BadRequestException('Tên sự kiện ưu đãi đã tồn tại');
      }
    }
    return await this.suKienUuDaiRepository.update(id, data);
  }

  async changeStatus(id: string, trangThai: string) {
    const existingSuKienUuDai = await this.suKienUuDaiRepository.findById(id);
    if (!existingSuKienUuDai) {
      throw new BadRequestException('Sự kiện ưu đãi không tồn tại');
    }
    if (!(trangThai in TrangThai)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }
    return await this.suKienUuDaiRepository.changeTrangThai(
      id,
      trangThai as TrangThai,
    );
  }

  //kiểm tra sự kiện ưu đãi có trong khoảng thời gian ưu đãi hay không
  async isEventActive(eventId: string): Promise<boolean> {
    const event = await this.suKienUuDaiRepository.findById(eventId);
    if (!event) {
      throw new BadRequestException('Sự kiện ưu đãi không tồn tại');
    }
    const currentDate = new Date();
    //nếu nằm trong khoảng thời gian nhưng trang thái là INACTIVE thì cũng không được áp dụng
    if (event.TrangThai === TrangThai.INACTIVE) {
      return false;
    }
    return event.NgayPH <= currentDate && event.NgayKT >= currentDate;
  }
}
