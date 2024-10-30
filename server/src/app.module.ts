import {AuthenticationGuard, AuthorizationGuard} from '@common/guards';
import {CurrentUserMiddleware} from '@common/middlewares';
import {ConfigModule} from '@modules/config';
import {AuthModule} from '@modules/core/auth';
import {ClassroomsModule} from '@modules/core/classrooms';
import {UsersModule} from '@modules/core/users';
import {DatabaseModule} from '@modules/database';
import {MiddlewareConsumer, Module} from '@nestjs/common';
import {AgoraModule} from '@modules/core/agora';
import {APP_GUARD} from '@nestjs/core';
import {ClassroomChatsModule} from '@modules/core/classroom-chats';
import {SessionsModule} from '@modules/sessions';
import {GoogleModule} from '@modules/google';
import {MaterialsModule} from '@modules/core/materials';
import {PdfModule} from '@modules/pdf';
import {ClassroomQuizzesModule} from '@modules/core/classroom-quizzes';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    ClassroomsModule,
    ClassroomChatsModule,
    ClassroomQuizzesModule,
    AgoraModule,
    SessionsModule,
    GoogleModule,
    MaterialsModule,
    PdfModule
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
