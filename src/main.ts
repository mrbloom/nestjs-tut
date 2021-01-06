import { NestFactory } from '@nestjs/core';
import { Logger, InternalServerErrorException } from '@nestjs/common';

import { AppModule } from './app.module';

import * as config from 'config';

function configurate(path: string, logger: Logger): number {
  let port: number;
  try {
    port = config.get(path);
    return port;
  } catch (error) {
    logger.error('Error in initialize of port pf app', error.stack);
    throw new InternalServerErrorException();
  }
}

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const port = configurate('server.port', logger);

  const app = await NestFactory.create(AppModule);

  logger.log('Start logger in bootstrap');
  if (process.env.NODE_ENV === 'development') {
    logger.log(`Attention CORS enable in ${process.env.NODE_ENV} mode`);
    app.enableCors();
  } else {
    logger.log(`Attention CORS DISABLED in ${process.env.NODE_ENV} mode`);
  }
  await app.listen(process.env.PORT || port);
  // await app.listen(3000);

  logger.log(`App listening on port ${port}`);
}
bootstrap();
