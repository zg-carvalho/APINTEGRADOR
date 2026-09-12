import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoticiaDto } from "./dto/create-noticia.dto";
import { UpdateNoticiaDto } from "./dto/update-noticia.dto";

export interface Noticia {
  id: number;
  slog?: string;
  description?: string;
  auth?: string;
  createdAt: Date;
}

@Injectable()
export class NoticiaService {

  private noticias: Noticia[] = [];

  private nextId = 1;


  create(createNoticiaDto: CreateNoticiaDto): Noticia {

    const newNoticia: Noticia = {
      id: this.nextId++,
      ...createNoticiaDto,
      createdAt: new Date()
    }

    this.noticias.push(newNoticia)

    return newNoticia
  }

  findAll(): Noticia[] {

    return this.noticias
  }

  findOne(id: number): Noticia {

    const noticia = this.noticias.find((p) => p.id === id)

    if (!noticia) {
      throw new NotFoundException(`Noticia com ID ${id} não encontrodo.`)
    }

    return noticia
  }

  update(id: number, updateNoticiaDto: UpdateNoticiaDto): Noticia {
    const noticia = this.findOne(id)

    Object.assign(noticia, updateNoticiaDto)
    
    return noticia
  }

  remove(id: number): void {
    this.findOne(id)

    this.noticias = this.noticias.filter((p) => p.id !== id)
  }
}
