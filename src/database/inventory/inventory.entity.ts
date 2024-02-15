import {
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { Book } from '../book';
import { Store } from '../store';
import { InventoryRepository } from './inventory.repository';

@Entity()
export class Inventory extends BaseEntity {
  [EntityRepositoryType]?: InventoryRepository;

  @ManyToOne(() => Book)
  book: Book;

  @ManyToOne(() => Store)
  bookStore: Store;

  @Property()
  quantity: number;
}

export type InventoryDTO = EntityDTO<Inventory>;
