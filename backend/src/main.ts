import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './core/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { SupabaseAuthGuard } from './auth/supabase-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // app.useGlobalGuards(new SupabaseAuthGuard());
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '10mb' }));
  app.enableCors({
    origin: [`${process.env.FRONTEND_URL}`, 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    credentials: true,
  });
  // Cấu hình Swagger
  const config = new DocumentBuilder()
    .setTitle('Flex Style API')
    .setDescription('API documentation for Flex Style e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(configService.get('PORT') ?? 8080);
}

bootstrap();
