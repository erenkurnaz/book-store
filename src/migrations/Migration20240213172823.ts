import { Migration } from '@mikro-orm/migrations';

export class Migration20240213172823 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "user" ("id" uuid not null, "created_at" timestamptz not null default \'now()\', "updated_at" timestamptz null, "email" varchar(255) not null, "password" varchar(255) not null, "full_name" varchar(255) not null, constraint "user_pkey" primary key ("id"));',
    );
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );
  }
}
