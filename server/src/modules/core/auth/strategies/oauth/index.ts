import {GoogleAuthStrategy} from './google.strategy';

export {OAuthBase, OAuthUser, OAuthConfig} from './base.strategy';
export {GoogleAuthStrategy} from './google.strategy';

export const oauthStrategy = {
  google: GoogleAuthStrategy
} as const;

export type OAuthStrategy = keyof typeof oauthStrategy;
