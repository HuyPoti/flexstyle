import { Module } from '@nestjs/common';
import { ThongbaoController } from './thongbao.controller';
import { ThongbaoService } from './thongbao.service';
import { ThongbaoRepository } from 'src/repositories/thongbao.repository';

@Module({
  controllers: [ThongbaoController],
  providers: [ThongbaoService, ThongbaoRepository],
  exports: [ThongbaoRepository],
})
export class ThongbaoModule {}
