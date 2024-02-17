import {
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/core';

import { Book } from '../book';
import { Store } from '../store';
import { InventoryRepository } from './inventory.repository';

@Entity()
@Unique({ properties: ['book', 'store'] })
export class Inventory {
  [EntityRepositoryType]?: InventoryRepository;

  @ManyToOne(() => Book, { primary: true })
  book: Book;

  @ManyToOne(() => Store, { primary: true })
  store: Store;

  @Property()
  quantity: number;
}

export type InventoryDTO = EntityDTO<Inventory>;
