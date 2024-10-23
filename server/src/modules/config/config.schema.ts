import {Env} from '@common/types';
import {z} from 'zod';

export const configSchema = z.object({
  NODE_ENV: z.nativeEnum(Env),
  PORT: z.coerce.number().min(4000).max(8000),
  DATABASE_URI: z.string().url(),
  SESSION_SECRET: z.string(),
  GOOGLE_AUTH_CLIENT_ID: z.string(),
  GOOGLE_AUTH_SECRET: z.string(),
  GOOGLE_AUTH_REDIRECT_URL: z.string().url(),
  CLIENT_APP_URL: z.string().url()
});

export type ConfigSchema = Required<z.infer<typeof configSchema>>;
