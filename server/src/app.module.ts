import {AuthenticationGuard, AuthorizationGuard} from '@common/guards';
import {CurrentUserMiddleware} from '@common/middlewares';
import {ConfigModule} from '@modules/config';
import {AuthModule} from '@modules/core/auth';
import {ClassroomsModule} from '@modules/core/classrooms';
import {UsersModule} from '@modules/core/users';
import {DatabaseModule} from '@modules/database';
import {MiddlewareConsumer, Module} from '@nestjs/common'; 
import { AgoraModule } from '@modules/core/agora';
import { ChatModule } from '@modules/core/chat';
import {APP_GUARD} from '@nestjs/core';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ClassroomsModule,
    AgoraModule,
    ChatModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard
    },
    {
      provide: APP_GUARD,
      useClass: AuthorizationGuard
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
