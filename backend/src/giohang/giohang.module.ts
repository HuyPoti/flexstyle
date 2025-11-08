import { Module } from '@nestjs/common';
import { GiohangController } from './giohang.controller';
import { GiohangService } from './giohang.service';
import { PrismaModule } from 'src/prisma.module';
import { GiohangRepository } from 'src/repositories/giohang.repository';

@Module({
  imports: [PrismaModule],
  controllers: [GiohangController],
  providers: [GiohangService, GiohangRepository],
  exports: [GiohangService, GiohangRepository],
})
export class GiohangModule {
  constructor() {
    console.log('[GiohangModule] Registered with Repository pattern');
  }
}