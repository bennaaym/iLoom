export enum Env {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

export type ExplicityAny = any;

export enum EUserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
}

export type UserSession = {
  userId: string;
} & Record<string, ExplicityAny>;
