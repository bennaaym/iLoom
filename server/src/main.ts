import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '@common/filters';
import { ConfigService } from '@modules/config';
import { RequestResponseInterceptor } from '@common/interceptors';
import * as session from 'express-session';
import { Env } from '@common/types';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(
    session({
      secret: config.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: config.databaseURI === Env.PRODUCTION,
        maxAge: 1000 * 60 * 60 * 24,
      },
    }),
  );
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new RequestResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(config.env));

  await app.listen(config.port);
};

bootstrap();
