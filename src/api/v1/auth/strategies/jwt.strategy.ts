import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { ITokenPayload } from '../../lib/types';

import { strategyConstants } from '../constants';
import { Request } from 'express';
import { AuthService } from '../auth.service';

/**
 * Extracts the cookie value from the request object
 */
export const cookieExtractor = (request: Request): string => {
  let accessToken = null;

  if (request.cookies)
    accessToken = request.cookies[strategyConstants.cookieName];

  return accessToken;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  strategyConstants.jwt,
) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: ITokenPayload) {
    // entityType determines where data is pulled from
    const { entityType, email } = payload;

    return await this.authService.getJwtData(entityType, email);
  }
}
