import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS 설정
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000', // Next.js 클라이언트 URL
    credentials: true, // 인증 관련 헤더 허용
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
