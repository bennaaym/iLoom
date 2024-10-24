import {Injectable} from '@nestjs/common';
import {ConfigSchema} from './config.schema';
import {ConfigService as NestConfigService} from '@nestjs/config';
import {Env} from '@common/types';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  private get<T extends keyof ConfigSchema>(key: T) {
    return this.configService.get<ConfigSchema[T]>(key);
  }

  get env() {
    return this.get('NODE_ENV');
  }

  get databaseURI() {
    return this.get('DATABASE_URI');
  }

  get port() {
    return this.get('PORT');
  }

  get sessionSecret() {
    return this.get('SESSION_SECRET');
  }

  get oauth() {
    return {
      google: {
        clientId: this.get('GOOGLE_AUTH_CLIENT_ID'),
        clientSecret: this.get('GOOGLE_AUTH_SECRET'),
        redirectUrl: this.get('GOOGLE_AUTH_REDIRECT_URL')
      }
    } as const;
  }

  get agora() {
    return {
      appID: this.get('AGORA_APP_ID'),
      appCertificate: this.get('AGORA_APP_CERTIFICATE')
    } as const;
  }

  get clientAppURL() {
    return this.get('CLIENT_APP_URL');
  }

  get session() {
    return {
      secret: this.sessionSecret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: this.env === Env.PRODUCTION,
        secure: this.databaseURI === Env.PRODUCTION,
        maxAge: 1000 * 60 * 60 * 24
      }
    };
  }
}
