import { Migration } from '@mikro-orm/migrations';

export class Migration20240214081956 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "book" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "name" varchar(255) not null, constraint "book_pkey" primary key ("id"));');
    this.addSql('alter table "book" add constraint "book_name_unique" unique ("name");');

    this.addSql('create table "book_store" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "name" varchar(255) not null, constraint "book_store_pkey" primary key ("id"));');
    this.addSql('alter table "book_store" add constraint "book_store_name_unique" unique ("name");');

    this.addSql('create table "book_store_managers" ("book_store_id" uuid not null, "user_id" uuid not null, constraint "book_store_managers_pkey" primary key ("book_store_id", "user_id"));');

    this.addSql('alter table "book_store_managers" add constraint "book_store_managers_book_store_id_foreign" foreign key ("book_store_id") references "book_store" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "book_store_managers" add constraint "book_store_managers_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "book_store_managers" drop constraint "book_store_managers_book_store_id_foreign";');
  }

}
