export enum Env {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export enum EUserRole {
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student'
}

export type ExplicityAny = any;

export type UserSession = {
  userId: string;
} & Record<string, ExplicityAny>;
