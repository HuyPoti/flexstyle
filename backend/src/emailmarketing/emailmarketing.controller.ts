import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { EmailmarketingService } from './emailmarketing.service';
import { Roles } from 'src/factory_function/role';
import { TaiKhoanGuard } from 'src/taikhoan/taikhoan.guard';
import { JwtAuthGuard } from 'src/jwt/jwt.guard';
import type { Response } from 'express';

@Controller('emailmarketing')
export class EmailmarketingController {
  constructor(private readonly emailmarketingService: EmailmarketingService) {}
  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('export-users')
  async exportUsers(@Res() res: Response) {
    const csv = await this.emailmarketingService.exportUserEmails();
    if (!csv) {
      throw new Error('Failed to generate CSV data');
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="users.csv"');
    res.send(csv); // Trả về chuỗi CSV
  }

  @Roles('QLDN')
  @UseGuards(JwtAuthGuard, TaiKhoanGuard)
  @Get('export-newsletter-subscribed')
  async exportNewsletterSubscribed(@Res() res: Response) {
    const csv = await this.emailmarketingService.exportNewsletterSubscribed();
    if (!csv) {
      throw new Error('Failed to generate CSV data');
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="newsletter_subscribers.csv"',
    );
    res.send(csv); // Trả về chuỗi CSV
  }
  @Post('subscribe-newsletter')
  subscribeNewsletter(@Body('email') email: string) {
    return this.emailmarketingService.createNewsletter(email);
  }
  @Get()
  getAll() {
    return this.emailmarketingService.getAll();
  }
}
