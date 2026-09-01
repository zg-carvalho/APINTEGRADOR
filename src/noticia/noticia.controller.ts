import { Body, Controller, Get, HttpCode, HttpStatus, ParseIntPipe, Post, Param, Patch,Delete } from "@nestjs/common";
import { NoticiaService } from "./noticia.service";
import { CreateNoticiaDto } from "./dto/create-noticia.dto"
import { UpdateNoticiaDto } from "./dto/update-noticia.dto";


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

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.noticiaService.findOne(id)
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
}