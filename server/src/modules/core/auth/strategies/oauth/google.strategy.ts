import {OAuth2Client} from 'google-auth-library';
import {OAuthBase, OAuthConfig, OAuthUser} from './base.strategy';

export class GoogleAuthStrategy extends OAuthBase<OAuth2Client> {
  constructor(config: OAuthConfig) {
    super(
      new OAuth2Client(
        config.clientId,
        config.clientSecret,
        config.redirectUrl
      ),
      config
    );
  }

  generateAuthUrl() {
    const authUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: ['userinfo.profile', 'userinfo.email'].map(
        (scope) => `https://www.googleapis.com/auth/${scope}`
      )
    });
    return authUrl;
  }

  async handleCallback(redirectUrl: string): Promise<OAuthUser> {
    const code = this.extractCodeFromRedirectUrl(redirectUrl);
    const {tokens} = await this.client.getToken(code);
    const ticket = await this.client.verifyIdToken({
      idToken: tokens.id_token as string
    });

    const payload = ticket.getPayload();

    return {
      userId: payload?.sub,
      email: payload?.email,
      name: payload?.name
    } as const;
  }
}
