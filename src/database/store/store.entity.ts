import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  OneToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { StoreRepository } from './store.repository';
import { Inventory } from '../inventory';

@Entity({ repository: () => StoreRepository })
export class Store extends BaseEntity {
  [EntityRepositoryType]?: StoreRepository;

  @Property({ unique: true })
  name: string;

  @OneToMany(() => Inventory, (inventory) => inventory.bookStore)
  inventory = new Collection<Inventory>(this);
}

export type StoreDTO = EntityDTO<Store>;
