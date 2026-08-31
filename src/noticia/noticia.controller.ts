import { Body, Controller, Get, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { NoticiaService } from "./noticia.service";
import { CreateNoticiaDto } from "./dto/create-noticia.dto"


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
    findAll(){
        return this.noticiaService.findAll()
    }
}