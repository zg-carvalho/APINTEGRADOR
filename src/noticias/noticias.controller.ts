import {// Controller é uma camada considera garçom, porque a função dele é receber pedidos das rotas http e levar para a camada Serviço
  Controller, // e devolver com o status semântico correto. Ele é quem faz as requisições com os verbos que estão importados aqui
  Get,  // os verbos tem a ação de criar, listar, atualizar ou deletar
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

@Controller('noticias')  // Criação da URI (noticias) é sempre um substantivo no plural. URI é o caminho  
export class NoticiasController { 
  
  constructor(private readonly noticiasService: NoticiaService) {}

  @Post('upload')//A ação que queremos executar é determinada unicamente pelo verbo HTTP, neste caso o verbo Post = criar

  @UseGuards(JwtAuthGuard) //@UseGuards(JwtAuthGuard): Garante que apenas usuários logados (que enviem o Bearer Token válido) possam fazer upload de fotos.
  @UseInterceptors(//Ele intercepta a requisição HTTP, extrai o arquivo enviado e o configura usando as seguintes regras:
    FileInterceptor('file', {//Diz que o arquivo deve vir dentro de um campo chamado file (no FormData do seu frontend).
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),// Define que todas as imagens enviadas serão salvas fisicamente em uma pasta chamada uploads na raiz do seu projeto backend.
        filename: (_req, file, cb) => {//Evita que arquivos com o mesmo nome se sobrescrevam. Ele gera um identificador único universal
          const unique = randomUUID();// (randomUUID()) e mantém a extensão original do arquivo (convertida para letras minúsculas)
          cb(null, `${unique}${extname(file.originalname).toLowerCase()}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, //Limita o tamanho máximo do arquivo enviado para 10 Megabytes. Se alguém tentar enviar um arquivo maior, a API rejeita.
      fileFilter: (_req, file, cb) => {//Uma camada extra de proteção. Ele verifica se o arquivo é realmente uma imagem testando o tipo (image/)
        const ext = extname(file.originalname).toLowerCase();
        const isImage =
          file.mimetype.startsWith('image/') || IMAGE_EXTS.includes(ext);
        if (isImage) { // Se o usuário envie uma requisição POST vazia sem o arquivo anexado, o NestJS barra imediatamente.
          cb(null, true);
        } else {
          cb(new BadRequestException('Tipo de arquivo não permitido'), false);
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado');// Se tudo der certo, o arquivo é salvo no disco do servidor e o método retorna um objeto contendo a URL completa da imagem. 
    return { url: `http://localhost:3000/uploads/${file.filename}` };//Esse link é o que o seu frontend (ou Postman) recebe para salvar depois dentro do campo coverImage na hora de criar a notícia.
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  
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

  //remover uma notícia do banco de dados com base no ID fornecido.
  @Delete(':id') //Define que esta rota responde a requisições HTTP do tipo DELETE esperando um parâmetro na URL (ex: /noticias/5).
  @UseGuards(JwtAuthGuard)//Protege a rota. Significa que apenas usuários autenticados (que enviaram um token JWT válido no cabeçalho da requisição) podem deletar uma notícia.
  @HttpCode(HttpStatus.NO_CONTENT)//Define que, se a exclusão for bem-sucedida, o servidor responderá com o status HTTP 204 No Content.

  remove(@Param('id', ParseIntPipe) id: number) {//Captura o parâmetro id enviado na URL e usa o ParseIntPipe para garantir que ele seja convertido e validado como um número (number). 
   //Se o usuário passar algo que não seja um número (como /noticias/abc), o framework barra a requisição automaticamente.
   
    return this.noticiasService.remove(id);//Chama a camada de serviço (noticiasService), que contém a lógica de negócio para buscar e deletar a notícia do banco de dados utilizando o ID validado.
  }
}