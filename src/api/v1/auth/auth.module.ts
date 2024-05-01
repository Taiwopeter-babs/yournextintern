import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { CompanyModule } from '../company/company.module';
import { InternModule } from '../intern/intern.module';

import {
  CompanyJwtStrategy,
  InternJwtStrategy,
} from './strategies/jwt.strategy';

import {
  CompanyLocalStrategy,
  InternLocalStrategy,
} from './strategies/local.strategy';

@Module({
  imports: [
    CompanyModule,
    InternModule,
    PassportModule,
    ConfigModule,

    // Jwt module configuration
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: parseInt(
            configService.get<string>('JWT_VALID_TIME') as string,
            10,
          ),
        },
      }),
    }),
  ],
  providers: [
    AuthService,
    CompanyLocalStrategy,
    CompanyJwtStrategy,
    InternJwtStrategy,
    InternLocalStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
