import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { BookStoreRepository } from './book-store.repository';
import { User } from '../user';
import { BookInventory } from '../book-inventory';

@Entity({ repository: () => BookStoreRepository })
export class BookStore extends BaseEntity {
  [EntityRepositoryType]?: BookStoreRepository;

  @Property({ unique: true })
  name: string;

  @ManyToMany()
  managers = new Collection<User>(this);

  @OneToMany(() => BookInventory, (bookInventory) => bookInventory.bookStore)
  bookInventory = new Collection<BookInventory>(this);
}

export type BookStoreDTO = EntityDTO<BookStore>;
