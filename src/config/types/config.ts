export enum RuntimeMode {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export interface IConfig {
  mode: RuntimeMode;
  port: number;
}
