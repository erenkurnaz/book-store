import {
  Collection,
  Entity,
  EntityDTO,
  EntityRepositoryType,
  ManyToMany,
  Property,
} from '@mikro-orm/core';

import { BaseEntity } from '../base/base-entity';
import { RoleRepository } from './role.repository';
import { User } from '../user';

@Entity({ repository: () => RoleRepository })
export class Role extends BaseEntity {
  [EntityRepositoryType]?: RoleRepository;

  @Property({ unique: true })
  name: string;

  @ManyToMany({ mappedBy: 'roles', hidden: true })
  users = new Collection<User>(this);
}

export type RoleDTO = EntityDTO<Omit<Role, 'users'>>;
