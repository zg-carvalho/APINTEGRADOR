import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateNoticiaDto } from "./dto/create-noticia.dto";
import { UpdateNoticiaDto } from "./dto/update-noticia.dto";

export interface PageSection {
  id?: string;
  type?: string;
  content?: Record<string, any>;
}

export interface Noticia {
  id: number;
  name?: string;
  slug?: string;
  description?: string;
  coverImage?: string;
  sections: PageSection[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NoticiaService {

  private noticias: Noticia[] = [];

  private nextId = 1;


  create(createNoticiaDto: CreateNoticiaDto): Noticia {

    const newNoticia: Noticia = {
      id: this.nextId++,
      name: createNoticiaDto.name,
      slug: createNoticiaDto.slug,
      description: createNoticiaDto.description,
      coverImage: createNoticiaDto.coverImage,
      sections: createNoticiaDto.sections ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),

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

  findBySlug(slug: string): Noticia {
    const noticia = this.noticias.find((p) => p.slug === slug);
    if (!noticia) {
      throw new NotFoundException(`Noticia com slug "${slug}" não encontrada`)
    }
    return noticia;
  }
}
