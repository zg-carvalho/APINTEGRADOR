import { Injectable } from "@nestjs/common";
import { CreateNoticiaDto } from "./dto/create-noticia.dto";

export interface Noticia {
  id: number;
  name?: string;
  description?: string;
  auth?:string;
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
      createdAt:new Date()
    }

    this.noticias.push(newNoticia)

    return newNoticia
}

findAll(): Noticia[]{

  return this.noticias
}

}
