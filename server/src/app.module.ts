import { AuthenticationGuard, AuthorizationGuard } from '@common/guards';
import { CurrentUserMiddleware } from '@common/middlewares';
import { ConfigModule } from '@modules/config';
import { AuthModule } from '@modules/core/auth';
import { UsersModule } from '@modules/core/users';
import { DatabaseModule } from '@modules/database';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ConfigModule, DatabaseModule, AuthModule, UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
