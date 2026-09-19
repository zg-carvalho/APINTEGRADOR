import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateNoticiaDto } from './dto/create-noticia.dto.js';
import { UpdateNoticiaDto } from './dto/update-noticia.dto.js';

export interface PageSection {
  id: string;
  type: string;
  content: Record<string, any>;
}

export interface Noticia {
  id: number;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  sections: PageSection[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class NoticiaService {
  private noticias: Noticia[] = [];
  private nextId = 1;

  create(dto: CreateNoticiaDto): Noticia {
    const slugInUse = this.noticias.some((p) => p.slug === dto.slug);
    if (slugInUse) {
      throw new ConflictException(
        `Já existe uma noticia com o slug "${dto.slug}".`,
      );
    }

    const noticia: Noticia = {
      id: this.nextId++,
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      coverImage: dto.coverImage,
      sections: dto.sections ?? [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.noticias.push(noticia);
    return noticia;
  }

  findAll(): Noticia[] {
    return this.noticias;
  }

  findOne(id: number): Noticia {
    const noticia = this.noticias.find((p) => p.id === id);
    if (!noticia) {
      throw new NotFoundException(`Noticia com ID ${id} não encontrado.`);
    }
    return noticia;
  }

  findBySlug(slug: string): Noticia {
    const noticia = this.noticias.find((p) => p.slug === slug);
    if (!noticia) {
      throw new NotFoundException(`Noticia com slug "${slug}" não encontrado.`);
    }
    return noticia;
  }

  update(id: number, dto: UpdateNoticiaDto): Noticia {
    const noticia = this.findOne(id);

    if (dto.slug && dto.slug !== noticia.slug) {
      const slugInUse = this.noticias.some(
        (p) => p.slug === dto.slug && p.id !== id,
      );
      if (slugInUse) {
        throw new ConflictException(
          `Já existe uma noticia com o slug "${dto.slug}".`,
        );
      }
    }

    Object.assign(noticia, { ...dto, updatedAt: new Date() });
    return noticia;
  }

  remove(id: number): void {
    this.findOne(id);
    this.noticias = this.noticias.filter((p) => p.id !== id);
  }
}
