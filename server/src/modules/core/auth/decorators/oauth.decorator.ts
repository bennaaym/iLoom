import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {OAuthBase, OAuthStrategy, oauthStrategy} from '../strategies/oauth';
import {ClassConstructor} from 'class-transformer';
import {ConfigService} from '@modules/config';
import {ConfigService as NestConfigService} from '@nestjs/config';
import {Request} from 'express';
import {ExplicityAny} from '@common/types';

class OAuthUrlInterceptor<Strategy extends OAuthBase<unknown>>
  implements NestInterceptor
{
  private readonly oauth: Strategy;

  constructor(
    private readonly strategy: OAuthStrategy,
    private readonly cls: ClassConstructor<Strategy>,
    private readonly config: ConfigService
  ) {
    this.oauth = new this.cls(this.config.oauth[this.strategy]);
  }

  async intercept(
    context: ExecutionContext,
    handler: CallHandler
  ): Promise<Observable<ExplicityAny>> {
    const response = context.switchToHttp().getResponse();
    response.redirect(await this.oauth.generateAuthUrl());
    return handler.handle();
  }
}

export const OAuth = (strategy: OAuthStrategy) => {
  if (!(strategy in oauthStrategy)) throw Error('Invalid OAuth strategy');
  return UseInterceptors(
    new OAuthUrlInterceptor(
      strategy,
      oauthStrategy[strategy],
      new ConfigService(new NestConfigService())
    )
  );
};

class OAuthCallbackInterceptor<Strategy extends OAuthBase<unknown>>
  implements NestInterceptor
{
  private readonly oauth: Strategy;

  constructor(
    private readonly strategy: OAuthStrategy,
    private readonly cls: ClassConstructor<Strategy>,
    private readonly config: ConfigService
  ) {
    this.oauth = new this.cls(this.config.oauth[this.strategy]);
  }

  async intercept(
    context: ExecutionContext,
    handler: CallHandler
  ): Promise<Observable<ExplicityAny>> {
    const request = context.switchToHttp().getRequest() as Request;
    const oauthUser = await this.oauth.handleCallback(request.url);
    request.oauthUser = oauthUser;
    return handler.handle();
  }
}

export const OAuthCallback = (strategy: OAuthStrategy) => {
  if (!(strategy in oauthStrategy)) throw Error('Invalid OAuth strategy');
  return UseInterceptors(
    new OAuthCallbackInterceptor(
      strategy,
      oauthStrategy[strategy],
      new ConfigService(new NestConfigService())
    )
  );
};
