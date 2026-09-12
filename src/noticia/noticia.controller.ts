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
    UploadedFile,
    BadRequestException,
    UseInterceptors,

} from "@nestjs/common";
import { diskStorage } from "multer";
import { NoticiaService } from "./noticia.service";
import { CreateNoticiaDto } from "./dto/create-noticia.dto"
import { UpdateNoticiaDto } from "./dto/update-noticia.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { randomUUID } from "crypto";
import { extname } from "path/posix";

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

@Controller('noticia')

export class NoticiaController {

    constructor(private readonly noticiaService: NoticiaService) { }
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @Body() createNoticiaDto: CreateNoticiaDto,
    ) {
        return this.noticiaService.create(createNoticiaDto)
    }

    @Get()
    findAll() {
        return this.noticiaService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.noticiaService.findOne(id)
    }

    @Get('slug/:slug')
    findSlug(@Param(`slug`) slug: string) {
        return this.noticiaService.findBySlug(slug);
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateNoticiaDto: UpdateNoticiaDto,
    ) {
        return this.noticiaService.update(id, UpdateNoticiaDto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.noticiaService.remove(id)
    }


    @Post('upload')
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


}

