import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  Enum,
  ManyToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { UserRepository } from './user.repository';
import { Store } from '../store';

export enum UserRole {
  USER = 'user',
  STORE_MANAGER = 'store_manager',
  ADMIN = 'admin',
}

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  fullName: string;

  @Enum({
    items: () => UserRole,
    default: UserRole.USER,
    nativeEnumName: 'user_role',
  })
  role: UserRole;

  @ManyToMany(() => Store, (store) => store.managers)
  stores = new Collection<Store>(this);
}

export type UserDTO = EntityDTO<User>;
