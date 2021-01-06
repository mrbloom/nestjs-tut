import * as config from 'config';

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';

function configurate<R>(path: string, logger: Logger): R {
  let value: R;
  try {
    value = config.get(path);
    return value;
  } catch (error) {
    logger.error('Error in initialize of database', error.stack);
    throw new InternalServerErrorException();
  }
}

// const dbConfig = config.get('db');
const logger = new Logger('TypeOrmModuleOptions');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: configurate<any>('db.type', logger),
  host: process.env.RDS_HOSTNAME || configurate<string>('db.host', logger),
  port: Number(process.env.RDS_PORT) || configurate<number>('db.port', logger),
  username:
    process.env.RDS_USERNAME || configurate<string>('db.username', logger),
  password:
    process.env.RDS_PASSWORD || configurate<string>('db.password', logger),
  database:
    process.env.RDS_DB_NAME || configurate<string>('db.database', logger),
  synchronize:
    Boolean(process.env.TYPEORM_SYNC) ||
    configurate<boolean>('db.synchronize', logger),
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  keepConnectionAlive: true, //added from https://docs.nestjs.com/recipes/hot-reload#typeorm
};
