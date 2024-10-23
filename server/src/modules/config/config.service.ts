import {Injectable} from '@nestjs/common';
import {ConfigSchema} from './config.schema';
import {ConfigService as NestConfigService} from '@nestjs/config';

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

  get clientAppURL() {
    return this.get('CLIENT_APP_URL');
  }
}
