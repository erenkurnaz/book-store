import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User, UserRepository } from './user';
import { EntityManager } from '@mikro-orm/postgresql';
import { Book, BookRepository } from './book';
import { BookStore, BookStoreRepository } from './book-store';
import { Role, RoleRepository } from './role';

@Module({
  imports: [MikroOrmModule.forFeature([User, Role, Book, BookStore])],
  providers: [
    {
      provide: UserRepository,
      useFactory: (em: EntityManager) => em.getRepository(User),
      inject: [EntityManager],
    },
    {
      provide: RoleRepository,
      useFactory: (em: EntityManager) => em.getRepository(Role),
      inject: [EntityManager],
    },
    {
      provide: BookRepository,
      useFactory: (em: EntityManager) => em.getRepository(Book),
      inject: [EntityManager],
    },
    {
      provide: BookStoreRepository,
      useFactory: (em: EntityManager) => em.getRepository(BookStore),
      inject: [EntityManager],
    },
  ],
  exports: [
    UserRepository,
    RoleRepository,
    BookRepository,
    BookStoreRepository,
  ],
})
export class DatabaseModule {}
