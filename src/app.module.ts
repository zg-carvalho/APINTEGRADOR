import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticiaModule } from './noticia/noticia.module';

@Module({
  imports: [NoticiaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
