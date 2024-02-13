import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { UserRepository } from './user.repository';
import { Role } from '../role';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  fullName: string;

  @ManyToMany()
  roles = new Collection<Role>(this);
}

export type UserDTO = EntityDTO<User>;
