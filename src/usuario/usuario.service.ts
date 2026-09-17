import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

export interface Usuario {
  id: number;
  name?: string;
  email?: string;
  password?: number;
  createdAt: Date;

}

@Injectable()
export class UsuarioService {

  private usuarios: Usuario[] = [];

  private nextId = 1;

  create(createUsuarioDto: CreateUsuarioDto): Usuario {

    const newUsuario: Usuario = {
      id: this.nextId++,
      ...CreateUsuarioDto,
      createdAt: new Date()
    }

    this.usuarios.push(newUsuario)

    return newUsuario
  }

  findAll(): Usuario[] {

    return this.usuarios
  }

  findOne(id: number): Usuario {

    const noticia = this.usuarios.find((p) => p.id === id)

    if (!noticia) {
      throw new NotFoundException(`Usuario com ID ${id} não encontrodo.`)
    }

    return noticia
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto): Usuario {
    const usuario = this.findOne(id)

    Object.assign(usuario, updateUsuarioDto)

    return usuario
  }

  remove(id: number): void {
    this.findOne(id)

    this.usuarios = this.usuarios.filter((p) => p.id !== id)
  }
}