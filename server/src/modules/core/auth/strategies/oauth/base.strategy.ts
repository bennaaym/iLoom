import * as url from 'url';
import * as querystring from 'querystring';
import {NotImplementedError} from '@common/errors';
import {lodash} from '@libs';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
}

export interface OAuthUser {
  userId: string;
  email?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      oauthUser?: OAuthUser;
    }
  }
}

export class OAuthBase<OAuthClient> {
  constructor(
    protected readonly client: OAuthClient,
    protected readonly config: OAuthConfig
  ) {
    if (!config.clientId || !config.clientSecret || !config.redirectUrl) {
      throw new Error('Invalid OAuth config');
    }
    this.client = client;
    this.config = config;
  }

  protected extractCodeFromRedirectUrl(redirectUrl: string): string {
    const query = url.parse(redirectUrl).query || '';
    const {code} = querystring.parse(query);

    if (!lodash.isString(code)) throw new Error('Invalid redirect url code');

    return code;
  }

  generateAuthUrl(): string | Promise<string> {
    throw new NotImplementedError();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleCallback(_: string): Promise<OAuthUser> {
    throw new NotImplementedError();
  }
}
