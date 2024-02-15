import { Migration } from '@mikro-orm/migrations';

export class Migration20240215151610 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "book" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "name" varchar(255) not null, constraint "book_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "book" add constraint "book_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "store" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "name" varchar(255) not null, constraint "store_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "store" add constraint "store_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "inventory" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "book_id" uuid not null, "book_store_id" uuid not null, "quantity" int not null, constraint "inventory_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "inventory" add constraint "inventory_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "inventory" add constraint "inventory_book_store_id_foreign" foreign key ("book_store_id") references "store" ("id") on update cascade;',
    );

    this.addSql(
      "create type \"user_role\" as enum ('user', 'store_manager', 'admin');",
    );
    this.addSql(
      'alter table "user" add column "role" "user_role" not null default \'user\';',
    );
    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "user" alter column "created_at" set default \'now()\';',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "inventory" drop constraint "inventory_book_id_foreign";',
    );

    this.addSql(
      'alter table "inventory" drop constraint "inventory_book_store_id_foreign";',
    );

    this.addSql('alter table "user" drop column "role";');

    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));',
    );
    this.addSql(
      'alter table "user" alter column "created_at" set default \'2024-02-15 15:04:33.874516+00\';',
    );
  }
}
