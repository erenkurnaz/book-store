import * as Joi from 'joi';
import { RuntimeMode } from './types/config';

export const configValidation = Joi.object({
  MODE: Joi.string()
    .valid(RuntimeMode.DEVELOPMENT, RuntimeMode.PRODUCTION)
    .default(RuntimeMode.DEVELOPMENT),
  PORT: Joi.number().default(3000),
  POSTGRES_DB: Joi.string().default('book-store'),
  POSTGRES_HOST: Joi.string().default('localhost'),
  POSTGRES_USER: Joi.string().default('postgres'),
  POSTGRES_PASSWORD: Joi.string().default('postgres'),
});
