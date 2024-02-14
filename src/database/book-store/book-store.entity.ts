import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { BookStoreRepository } from './book-store.repository';
import { BookInventory } from '../book-inventory';

@Entity({ repository: () => BookStoreRepository })
export class BookStore extends BaseEntity {
  [EntityRepositoryType]?: BookStoreRepository;

  @Property({ unique: true })
  name: string;

  @OneToMany(() => BookInventory, (bookInventory) => bookInventory.bookStore)
  bookInventory = new Collection<BookInventory>(this);
}

export type BookStoreDTO = EntityDTO<BookStore>;
