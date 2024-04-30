import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';

import { ITokenPayload } from '../../lib/types';

import { strategyConstants } from '../constants';
import Intern from '../../intern/intern.entity';
import { InternService } from '../../intern/intern.service';

/**
 * Extracts the cookie value from the request object
 */
export const cookieExtractor = (request: Request): string | null => {
  let accessToken = null;

  if (request && request.cookies)
    accessToken = request.cookies[strategyConstants.cookieName];

  return accessToken;
};

@Injectable()
export class InternLocalStrategy extends PassportStrategy(
  Strategy,
  strategyConstants.internAuth,
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // The email is read from the request body
    });
  }

  /** Populates the Request object with the company object */
  async validate(email: string, password: string): Promise<Intern> {
    return (await this.authService.validateIntern(email, password)) as Intern;
  }
}

@Injectable()
export class InternJwtStrategy extends PassportStrategy(
  Strategy,
  strategyConstants.internJwt,
) {
  constructor(
    configService: ConfigService,
    private readonly internService: InternService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: ITokenPayload) {
    // payload.sub references the id of the entity
    return this.internService.getIntern(payload.sub, true);
  }
}
