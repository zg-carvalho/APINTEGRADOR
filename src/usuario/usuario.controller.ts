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
import { UsuarioService } from "./usuario.service";
import { CreateUsuarioDto } from "./dto/create-usuario.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { randomUUID } from "crypto";
import { extname } from "path";
import { UpdateUsuarioDto } from "./dto/update-usuario.dto";


@Controller('usuario')

export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) { }
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(
        @Body() createUsuarioDto: CreateUsuarioDto,
    ) {
        return this.usuarioService.create(createUsuarioDto)
    }

    @Get()
    findAll() {
        return this.usuarioService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.findOne(id)
    }

    @Patch(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() UpdateUsuarioDto: UpdateUsuarioDto,
    ) {
        return this.usuarioService.update(id, UpdateUsuarioDto)
    }
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.remove(id)
    }
}