import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { BookRepository } from './book.repository';
import { Inventory } from '../inventory';

@Entity({ repository: () => BookRepository })
export class Book extends BaseEntity {
  [EntityRepositoryType]?: BookRepository;

  @Property({ unique: true })
  name: string;

  @OneToMany(() => Inventory, (inventory) => inventory.book)
  inventory = new Collection<Inventory>(this);
}

export type BookDTO = EntityDTO<Book>;
