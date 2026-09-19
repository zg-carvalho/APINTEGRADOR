import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
// CORREÇÃO 1: Alterado de NoticiasService para NoticiaService (no singular)
import { NoticiaService } from './noticias.service.js'; 
import { CreateNoticiaDto } from './dto/create-noticia.dto.js';
import { UpdateNoticiaDto } from './dto/update-noticia.dto.js';
import { JwtAuthGuard } from '../auth/jwt.guard.js';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

@Controller('noticias')
export class NoticiasController {
  // CORREÇÃO 2: Alterado a tipagem do construtor para NoticiaService (no singular)
  constructor(private readonly noticiasService: NoticiaService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const unique = randomUUID();
          cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
      fileFilter: (_req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const isImage =
          file.mimetype.startsWith('image/') || IMAGE_EXTS.includes(ext);
        if (isImage) {
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de arquivo não permitido'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');
    return { url: `http://localhost:3000/uploads/${file.filename}` };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  // CORREÇÃO 3: Substituído CreateProductDto por CreateNoticiaDto
  create(@Body() dto: CreateNoticiaDto) {
    return this.noticiasService.create(dto);
  }

  @Get()
  findAll() {
    return this.noticiasService.findAll();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.noticiasService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.noticiasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateNoticiaDto,
  ) {
    return this.noticiasService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.noticiasService.remove(id);
  }
}