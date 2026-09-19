import { Module } from '@nestjs/common';
import { NoticiasModule } from './noticias/noticias.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [AuthModule, NoticiasModule, UsersModule],
})
export class AppModule {}
