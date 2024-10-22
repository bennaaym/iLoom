import { Env } from '@common/types';
import { z } from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.nativeEnum(Env),
  PORT: z.coerce.number().min(4000).max(8000),
  DATABASE_URI: z.string().url(),
  SESSION_SECRET: z.string(),
});

export type ConfigSchema = Required<z.infer<typeof configSchema>>;
