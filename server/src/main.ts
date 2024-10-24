import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from '@nestjs/common';
import {HttpExceptionFilter} from '@common/filters';
import {ConfigService} from '@modules/config';
import {RequestResponseInterceptor} from '@common/interceptors';
import * as session from 'express-session';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({
    origin: config.clientAppURL,
    credentials: true
  });

  app.use(session(config.session));
  app.useGlobalPipes(new ValidationPipe({whitelist: true}));
  app.useGlobalInterceptors(new RequestResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(config.env));

  await app.listen(config.port);
};

bootstrap();
