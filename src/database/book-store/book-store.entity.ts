import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { BookStoreRepository } from './book-store.repository';
import { User } from '../user';

@Entity({ repository: () => BookStoreRepository })
export class BookStore extends BaseEntity {
  [EntityRepositoryType]?: BookStoreRepository;

  @Property({ unique: true })
  name: string;

  @ManyToMany()
  managers = new Collection<User>(this);
}

export type BookStoreDTO = EntityDTO<BookStore>;
