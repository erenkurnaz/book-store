import { Migration } from '@mikro-orm/migrations';

export class Migration20240214081956 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "book" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "name" varchar(255) not null, constraint "book_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "book" add constraint "book_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "book_store" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "name" varchar(255) not null, constraint "book_store_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "book_store" add constraint "book_store_name_unique" unique ("name");',
    );
  }
}
