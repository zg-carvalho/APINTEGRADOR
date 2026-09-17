import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NoticiaModule } from './noticia/noticia.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [NoticiaModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
