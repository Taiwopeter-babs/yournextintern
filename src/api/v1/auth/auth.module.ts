import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { CompanyModule } from '../company/company.module';
import {
  CompanyJwtStrategy,
  CompanyLocalStrategy,
} from './strategies/company.strategy';

import { InternModule } from '../intern/intern.module';
import {
  InternJwtStrategy,
  InternLocalStrategy,
} from './strategies/intern.strategy';

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
          expiresIn: `${configService.get<string>('JWT_VALID_TIME')}s`,
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
