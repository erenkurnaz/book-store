import * as Joi from 'joi';
import { RuntimeMode } from './types/config';

export const configValidation = Joi.object({
  MODE: Joi.string()
    .valid(RuntimeMode.DEVELOPMENT, RuntimeMode.PRODUCTION)
    .default(RuntimeMode.DEVELOPMENT),
  PORT: Joi.number().default(3000),
});
