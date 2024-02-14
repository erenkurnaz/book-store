import { Migration } from '@mikro-orm/migrations';

export class Migration20240214155948 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "book" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "book" alter column "created_at" set default \'now()\';',
    );

    this.addSql(
      'alter table "book_store" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "book_store" alter column "created_at" set default \'now()\';',
    );

    this.addSql(
      'alter table "book_inventory" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "book_inventory" alter column "created_at" set default \'now()\';',
    );

    this.addSql(
      'alter table "role" alter column "created_at" type timestamptz using ("created_at"::timestamptz);',
    );
    this.addSql(
      'alter table "role" alter column "created_at" set default \'now()\';',
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
      'alter table "book" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));',
    );
    this.addSql(
      'alter table "book" alter column "created_at" set default \'2024-02-14 15:59:48.852111+00\';',
    );

    this.addSql(
      'alter table "book_inventory" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));',
    );
    this.addSql(
      'alter table "book_inventory" alter column "created_at" set default \'2024-02-14 15:59:48.852111+00\';',
    );

    this.addSql(
      'alter table "book_store" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));',
    );
    this.addSql(
      'alter table "book_store" alter column "created_at" set default \'2024-02-14 15:59:48.852111+00\';',
    );

    this.addSql(
      'alter table "role" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));',
    );
    this.addSql(
      'alter table "role" alter column "created_at" set default \'2024-02-14 15:59:48.852111+00\';',
    );

    this.addSql(
      'alter table "user" alter column "created_at" type timestamptz(6) using ("created_at"::timestamptz(6));',
    );
    this.addSql(
      'alter table "user" alter column "created_at" set default \'2024-02-14 15:59:48.852111+00\';',
    );
  }
}
