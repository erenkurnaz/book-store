import {
  Entity,
  EntityDTO,
  EntityRepositoryType,
  Property,
  wrap,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { UserRepository } from './user.repository';

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository;

  @Property({ unique: true })
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  fullName: string;

  toJSON() {
    return wrap<User>(this).toObject();
  }
}

export type UserDTO = EntityDTO<User>;
