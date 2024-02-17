import { Migration } from '@mikro-orm/migrations';

export class Migration20240217120656 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "book" alter column "id" drop default;');
    this.addSql(
      'alter table "book" alter column "id" type uuid using ("id"::text::uuid);',
    );
    this.addSql(
      'alter table "book" alter column "id" set default gen_random_uuid();',
    );

    this.addSql('alter table "store" alter column "id" drop default;');
    this.addSql(
      'alter table "store" alter column "id" type uuid using ("id"::text::uuid);',
    );
    this.addSql(
      'alter table "store" alter column "id" set default gen_random_uuid();',
    );

    this.addSql('alter table "user" alter column "id" drop default;');
    this.addSql(
      'alter table "user" alter column "id" type uuid using ("id"::text::uuid);',
    );
    this.addSql(
      'alter table "user" alter column "id" set default gen_random_uuid();',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "book" alter column "id" drop default;');
    this.addSql('alter table "book" alter column "id" drop default;');
    this.addSql(
      'alter table "book" alter column "id" type uuid using ("id"::text::uuid);',
    );

    this.addSql('alter table "store" alter column "id" drop default;');
    this.addSql('alter table "store" alter column "id" drop default;');
    this.addSql(
      'alter table "store" alter column "id" type uuid using ("id"::text::uuid);',
    );

    this.addSql('alter table "user" alter column "id" drop default;');
    this.addSql('alter table "user" alter column "id" drop default;');
    this.addSql(
      'alter table "user" alter column "id" type uuid using ("id"::text::uuid);',
    );
  }
}
