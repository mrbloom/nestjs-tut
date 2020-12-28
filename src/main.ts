import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';

import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const serverConfig = config.get('server');

  const app = await NestFactory.create(AppModule);
  const port: number = serverConfig.port;
  await app.listen(process.env.PORT || port);
  // await app.listen(3000);

  logger.log(`App listening on port ${serverConfig.port}`);
}
bootstrap();
