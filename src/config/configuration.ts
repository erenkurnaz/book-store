import { IConfig, RuntimeMode } from './types/config';
import * as process from 'process';

export const configuration = (): IConfig => {
  const RUNTIME_MODE = <RuntimeMode>process.env.MODE || RuntimeMode.DEVELOPMENT;

  return {
    mode: RUNTIME_MODE,
    port: Number(process.env.PORT),
  };
};
