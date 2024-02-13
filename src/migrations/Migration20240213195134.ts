import { Migration } from '@mikro-orm/migrations';

export class Migration20240213195134 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "role" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "name" varchar(255) not null, constraint "role_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "role" add constraint "role_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "user_roles" ("user_id" uuid not null, "role_id" uuid not null, constraint "user_roles_pkey" primary key ("user_id", "role_id"));',
    );

    this.addSql(
      'alter table "user_roles" add constraint "user_roles_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "user_roles" add constraint "user_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "user_roles" drop constraint "user_roles_role_id_foreign";',
    );
  }
}
