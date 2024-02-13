import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';

export enum RuntimeMode {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export interface IConfig {
  mode: RuntimeMode;
  port: number;
  database: MikroOrmModuleOptions;
}
