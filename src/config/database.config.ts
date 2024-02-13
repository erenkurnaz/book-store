import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { EntityGenerator } from '@mikro-orm/entity-generator';

export default defineConfig({
  driver: PostgreSqlDriver,
  discovery: {
    warnWhenNoEntities: true,
  },
  dbName: process.env.POSTGRES_DB || 'book-store',
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  //debug: true,
  ensureDatabase: true,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  forceUtcTimezone: true,
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator, EntityGenerator],
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
    transactional: true,
    allOrNothing: true,
    dropTables: false,
    disableForeignKeys: false,
    safe: false,
    emit: 'ts',
  },
});
