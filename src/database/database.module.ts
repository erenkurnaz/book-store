import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User, UserRepository } from './user';
import { EntityManager } from '@mikro-orm/postgresql';
import { Book, BookRepository } from './book';
import { Store, StoreRepository } from './store';
import { Inventory, InventoryRepository } from './inventory';

@Module({
  imports: [MikroOrmModule.forFeature([User, Book, Store, Inventory])],
  providers: [
    {
      provide: UserRepository,
      useFactory: (em: EntityManager) => em.getRepository(User),
      inject: [EntityManager],
    },
    {
      provide: BookRepository,
      useFactory: (em: EntityManager) => em.getRepository(Book),
      inject: [EntityManager],
    },
    {
      provide: StoreRepository,
      useFactory: (em: EntityManager) => em.getRepository(Store),
      inject: [EntityManager],
    },
    {
      provide: InventoryRepository,
      useFactory: (em: EntityManager) => em.getRepository(Inventory),
      inject: [EntityManager],
    },
  ],
  exports: [
    UserRepository,
    BookRepository,
    StoreRepository,
    InventoryRepository,
  ],
})
export class DatabaseModule {}
