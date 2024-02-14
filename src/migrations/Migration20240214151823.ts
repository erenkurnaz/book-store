import { Migration } from '@mikro-orm/migrations';

export class Migration20240214151823 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "book_inventory" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "book_id" uuid not null, "book_store_id" uuid not null, "quantity" int not null, constraint "book_inventory_pkey" primary key ("id"));',
    );

    this.addSql(
      'alter table "book_inventory" add constraint "book_inventory_book_id_foreign" foreign key ("book_id") references "book" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "book_inventory" add constraint "book_inventory_book_store_id_foreign" foreign key ("book_store_id") references "book_store" ("id") on update cascade;',
    );
  }
}
