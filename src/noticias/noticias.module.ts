import { Module } from '@nestjs/common';
import { NoticiasController } from './noticias.controller.js';
import { NoticiaService } from './noticias.service.js';

@Module({
  controllers: [NoticiasController],
  providers: [NoticiaService], // CORREÇÃO: Tirado o "s" (mudei de NoticiasService para NoticiaService)
  exports: [NoticiaService],   // CORREÇÃO: Tirado o "s" (mudei de NoticiasService para NoticiaService)
})
export class NoticiasModule {}