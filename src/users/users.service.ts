import {
  Injectable,
  NotFoundException,
  ConflictException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import * as bcrypt from 'bcrypt';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PublicUser = Omit<User, 'password'>;

@Injectable()
export class UsersService implements OnModuleInit {
  private users: User[] = [];
  private nextId = 1;

  async onModuleInit() {
    const hash = await bcrypt.hash('admin123', 10);
    this.users.push({
      id: this.nextId++,
      name: 'Administrador',
      email: 'admin@camerite.com',
      password: hash,
      cpf: '000.000.000-00',
      phone: '(00) 00000-0000',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  private sanitize(user: User): PublicUser {
    const { password: _pwd, ...rest } = user;
    return rest;
  }

  async create(dto: CreateUserDto): Promise<PublicUser> {
    const emailInUse = this.users.some(
      (u) => u.email.toLowerCase() === dto.email.toLowerCase(),
    );
    if (emailInUse) {
      throw new ConflictException(
        `Já existe um usuário com o e-mail "${dto.email}".`,
      );
    }

    const hash = await bcrypt.hash(dto.password, 10);
    const user: User = {
      id: this.nextId++,
      name: dto.name,
      email: dto.email,
      password: hash,
      cpf: dto.cpf,
      phone: dto.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return this.sanitize(user);
  }

  findAll(): PublicUser[] {
    return this.users.map((u) => this.sanitize(u));
  }

  findOne(id: number): PublicUser {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    return this.sanitize(user);
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async update(id: number, dto: UpdateUserDto): Promise<PublicUser> {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }

    if (dto.email && dto.email.toLowerCase() !== user.email.toLowerCase()) {
      const emailInUse = this.users.some(
        (u) =>
          u.email.toLowerCase() === dto.email!.toLowerCase() && u.id !== id,
      );
      if (emailInUse) {
        throw new ConflictException(
          `Já existe um usuário com o e-mail "${dto.email}".`,
        );
      }
    }

    const { password, ...rest } = dto;
    Object.assign(user, { ...rest, updatedAt: new Date() });

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    return this.sanitize(user);
  }

  remove(id: number): void {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado.`);
    }
    this.users = this.users.filter((u) => u.id !== id);
  }
}
