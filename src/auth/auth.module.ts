import { Module, InternalServerErrorException, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from './user.repository';

import { JwtStrategy } from './jwt.strategy';

import * as config from 'config';

const logger = new Logger('AuthModule');

let expiresIn: number, secret: string;
try {
  expiresIn = config.get('jwt.expiresIn');
  secret = process.env.SECRET || config.get('jwt.secret');
} catch (error) {
  logger.error(
    'Something wrong in configuration  auth module from env vars or config files',
    error.stack,
  );
  throw new InternalServerErrorException();
}

@Module({
  imports: [
    JwtModule.register({
      secret,
      signOptions: {
        expiresIn,
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
