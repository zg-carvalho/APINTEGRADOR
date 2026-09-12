import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { mkdirSync } from 'node:fs';

async function bootstrap() {
 
 const app = await NestFactory.create<NestExpressApplication>(AppModule);

 const uploadsDir = join(process.cwd(), 'uploads');

 mkdirSync(uploadsDir, { recursive: true });

 app.useStaticAssets(uploadsDir, { prefix: '/uploads' });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
