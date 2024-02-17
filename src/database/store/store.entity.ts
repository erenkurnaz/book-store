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
import { StoreRepository } from './store.repository';
import { Inventory } from '../inventory';
import { User } from '../user';

@Entity({ repository: () => StoreRepository })
export class Store extends BaseEntity {
  [EntityRepositoryType]?: StoreRepository;

  @Property({ unique: true })
  name: string;

  @OneToMany(() => Inventory, (inventory) => inventory.store)
  inventory = new Collection<Inventory>(this);

  @ManyToMany()
  managers = new Collection<User>(this);
}

export type StoreDTO = EntityDTO<Store>;
