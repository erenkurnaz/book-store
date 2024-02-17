import { Migration } from '@mikro-orm/migrations';

export class Migration20240217175425 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "store_managers" ("store_id" uuid not null, "user_id" uuid not null, constraint "store_managers_pkey" primary key ("store_id", "user_id"));',
    );

    this.addSql(
      'alter table "store_managers" add constraint "store_managers_store_id_foreign" foreign key ("store_id") references "store" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "store_managers" add constraint "store_managers_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
  }
}
