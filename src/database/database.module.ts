import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { User, UserRepository } from './user';
import { EntityManager } from '@mikro-orm/postgresql';
import { Role, RoleRepository } from './role';

@Module({
  imports: [MikroOrmModule.forFeature([User, Role])],
  providers: [
    {
      provide: UserRepository,
      useFactory: (em: EntityManager) => em.getRepository(User),
      inject: [EntityManager],
    },
    {
      provide: RoleRepository,
      useFactory: (em: EntityManager) => em.getRepository(Role),
      inject: [EntityManager],
    },
  ],
  exports: [UserRepository, RoleRepository],
})
export class DatabaseModule {}
