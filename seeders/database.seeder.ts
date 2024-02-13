import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../src/database/role';
import { User } from '../src/database/user';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roles = ['admin', 'user', 'store_manager'].map((name) =>
      em.create(Role, { name }),
    );
    const users = [
      {
        fullName: 'Admin Doe',
        email: 'admin@mail.com',
        password: 'password',
        roles: [roles[0]],
      },
      {
        fullName: 'User Doe',
        email: 'user@mail.com',
        password: 'password',
        roles: [roles[1]],
      },
      {
        fullName: 'Manager Doe',
        email: 'manager@mail.com',
        password: 'password',
        roles: [roles[2]],
      },
    ];
    users.map((user) => em.create(User, user));
  }
}
