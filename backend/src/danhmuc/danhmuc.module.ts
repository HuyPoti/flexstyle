import { Module } from '@nestjs/common';
import { DanhMucService } from './danhmuc.service';
import { DanhMucController } from './danhmuc.controller';
import { ExcelService } from './excel.service';
import { DanhMucRepository } from 'src/repositories/danhmuc.repository';

@Module({
  providers: [DanhMucRepository, DanhMucService, ExcelService],
  controllers: [DanhMucController],
  exports: [DanhMucRepository],
})
export class DanhMucModule {}
