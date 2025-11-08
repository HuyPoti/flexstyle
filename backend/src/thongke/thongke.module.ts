import { Module } from '@nestjs/common';
import { ThongkeController } from './thongke.controller';
import { ThongkeService } from './thongke.service';
import { ThongkeRepository } from 'src/repositories/thongke.repository';

@Module({
  controllers: [ThongkeController],
  providers: [ThongkeService, ThongkeRepository],
  exports: [ThongkeRepository],
})
export class ThongkeModule {}
