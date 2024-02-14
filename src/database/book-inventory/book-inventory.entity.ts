import {
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { Book } from '../book';
import { BookStore } from '../book-store';
import { BookInventoryRepository } from './book-inventory.repository';

@Entity()
export class BookInventory extends BaseEntity {
  [EntityRepositoryType]?: BookInventoryRepository;

  @ManyToOne(() => Book)
  book: Book;

  @ManyToOne(() => BookStore)
  bookStore: BookStore;

  @Property()
  quantity: number;
}

export type BookInventoryDTO = EntityDTO<BookInventory>;
