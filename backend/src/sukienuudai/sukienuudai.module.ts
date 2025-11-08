import { Module } from '@nestjs/common';
import { SuKienUuDaiController } from './sukienuudai.controller';
import { SuKienUuDaiService} from './sukienuudai.service';
import { SuKienUuDaiRepository } from 'src/repositories/sukienuudai.repository';

@Module({
  controllers: [SuKienUuDaiController],
  providers: [SuKienUuDaiService, SuKienUuDaiRepository],
  exports: [SuKienUuDaiRepository],
})
export class SuKienUuDaiModule {}
