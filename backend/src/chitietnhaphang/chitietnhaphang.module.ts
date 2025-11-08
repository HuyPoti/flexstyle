import { Module } from '@nestjs/common';
import { ChitietnhaphangController } from './chitietnhaphang.controller';
import { ChitietnhaphangService } from './chitietnhaphang.service';
import { ChitietnhaphangRepository } from 'src/repositories/chitietnhaphang.repository';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ChitietnhaphangController],
  providers: [ChitietnhaphangService, ChitietnhaphangRepository, PrismaService],
  exports: [ChitietnhaphangService],
})
export class ChitietnhaphangModule {}
