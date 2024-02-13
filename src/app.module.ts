import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';

import { configuration, configValidation, IConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidation,
      load: [configuration],
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService<IConfig, true>) =>
        config.get('database'),
    }),
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  public async onModuleInit() {
    await this.orm.getMigrator().up();
  }
}
