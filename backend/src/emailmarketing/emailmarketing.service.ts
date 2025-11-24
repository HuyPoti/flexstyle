import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { formatCreatedAt } from 'utils/format';

@Injectable()
export class EmailmarketingService {
  constructor(private readonly prisma: PrismaService) {}
  exportUserEmails = async () => {
    const users = await this.prisma.tAIKHOAN.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    // Create CSV header
    const headers = ['Username', 'Email', 'created_at'];

    // Create CSV rows
    const rows = users.map((user) => {
      return [
        // `"${user.MaTK}"`,
        `"${user.Username || ''}"`,
        `"${user.Email || ''}"`,
        // `"${user.VAITRO || ''}"`,
        `"${user.created_at ? formatCreatedAt(new Date(user.created_at)) : ''}"`,
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    return '\uFEFF' + csv; // Add BOM for UTF-8 Excel compatibility
  };

  exportNewsletterSubscribed = async () => {
    const emailmarketingUser = await this.prisma.emailmarketing.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    // Create CSV header
    const headers = ['Email', 'Created Date'];

    // Create CSV rows
    const rows = emailmarketingUser.map((user) => {
      return [
        // `"${user.id}"`,
        `"${user.email || ''}"`,
        `"${user.created_at ? formatCreatedAt(new Date(user.created_at)) : ''}"`,
      ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    return '\uFEFF' + csv; // Add BOM for UTF-8 Excel compatibility
  };
  //tạo mới newsletter
  createNewsletter = async (email: string) => {
    const existing = await this.prisma.emailmarketing.findFirst({
      where: {
        email: email,
      },
    });
    if (existing) {
      throw new BadRequestException('Email đã đăng ký nhận bản tin');
    }
    return this.prisma.emailmarketing.create({
      data: {
        email,
      },
    });
  };
  getAll = async () => {
    const subscriber = await this.prisma.emailmarketing.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
    const user = await this.prisma.tAIKHOAN.findMany({
      where: {
        VAITRO: 'KH',
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    // gộp 2 mảng lại
    const combined = [...subscriber, ...user];
    //chỉ lấy 2 thuộc tính email và created_at và loại user hay subscriber
    const result = combined.map((item) => ({
      email: 'email' in item ? item.email : item.Email,
      created_at: item.created_at,
      type: 'email' in item ? 'subscriber' : 'user',
      VAITRO: 'VAITRO' in item ? item.VAITRO : null,
      Username: 'Username' in item ? item.Username : null,
    }));
    return result;
  };
}
