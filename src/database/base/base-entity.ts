import { PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ default: 'now()' })
  createdAt: Date;

  @Property({
    onUpdate: () => new Date(),
    nullable: true,
  })
  updatedAt: Date | null = null;
}
