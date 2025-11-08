import { Module } from '@nestjs/common';
import { TinhtrangDonhangController } from './tinhtrangdonhang.controller';
import { TinhtrangDonhangService } from './tinhtrangdonhang.service';
import { PrismaModule } from 'src/prisma.module';
import { TinhtrangDonhangRepository } from 'src/repositories/tinhtrangdonhang.repository';

@Module({
  imports: [PrismaModule],
  controllers: [TinhtrangDonhangController],
  providers: [TinhtrangDonhangService, TinhtrangDonhangRepository],
  exports: [TinhtrangDonhangService, TinhtrangDonhangRepository],
})
export class TinhtrangDonhangModule {
  constructor() {
    console.log('[TinhtrangDonhangModule] Registered with Repository pattern');
  }
}
