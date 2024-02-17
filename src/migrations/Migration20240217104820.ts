import { Migration } from '@mikro-orm/migrations';

export class Migration20240217104820 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "inventory" drop constraint "inventory_book_store_id_foreign";',
    );

    this.addSql('alter table "inventory" drop constraint "inventory_pkey";');
    this.addSql('alter table "inventory" drop column "id";');
    this.addSql('alter table "inventory" drop column "created_at";');
    this.addSql('alter table "inventory" drop column "updated_at";');
    this.addSql('alter table "inventory" drop column "book_store_id";');

    this.addSql('alter table "inventory" add column "store_id" uuid not null;');
    this.addSql(
      'alter table "inventory" add constraint "inventory_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "inventory" add constraint "inventory_book_id_store_id_unique" unique ("book_id", "store_id");',
    );
    this.addSql(
      'alter table "inventory" add constraint "inventory_pkey" primary key ("book_id", "store_id");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "inventory" drop constraint "inventory_store_id_foreign";',
    );

    this.addSql(
      'alter table "inventory" drop constraint "inventory_book_id_store_id_unique";',
    );
    this.addSql('alter table "inventory" drop constraint "inventory_pkey";');

    this.addSql(
      'alter table "inventory" add column "created_at" timestamptz not null default \'now()\', add column "updated_at" timestamptz null, add column "book_store_id" uuid not null;',
    );
    this.addSql(
      'alter table "inventory" add constraint "inventory_book_store_id_foreign" foreign key ("book_store_id") references "store" ("id") on update cascade;',
    );
    this.addSql('alter table "inventory" rename column "store_id" to "id";');
    this.addSql(
      'alter table "inventory" add constraint "inventory_pkey" primary key ("id");',
    );
  }
}
