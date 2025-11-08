import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from 'src/supabase/types';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly supabase: SupabaseClient<Database>;

  constructor(private readonly prisma: PrismaService) {
    this.supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) throw new UnauthorizedException('Missing token');

    const token = authHeader.replace('Bearer ', '');
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data?.user)
      throw new UnauthorizedException('Invalid or expired token');

    const dbUser = await this.prisma.tAIKHOAN.findFirst({
      where: { MaTK: data.user.id },
    });

    if (!dbUser) {
      throw new UnauthorizedException('Không tìm thấy user trong bảng public');
    }
    request.user = {
      id: data.user.id,
      role: dbUser.VAITRO,
    };
    return true;
  }
}
