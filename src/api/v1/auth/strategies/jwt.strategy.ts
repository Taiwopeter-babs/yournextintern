import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { ITokenPayload } from '../../lib/types';
import { CompanyService } from '../../company/company.service';

import { strategyConstants } from '../constants';
import { Request } from 'express';
import { InternService } from '../../intern/intern.service';

/**
 * Extracts the cookie value from the request object
 */
export const cookieExtractor = (request: Request): string => {
  let accessToken = null;

  console.log(`${request.cookies[strategyConstants.cookieName]} hello meee`);
  console.log(request.cookies);

  if (request.cookies)
    accessToken = request.cookies[strategyConstants.cookieName];

  return accessToken;
};

@Injectable()
export class CompanyJwtStrategy extends PassportStrategy(
  Strategy,
  strategyConstants.companyJwt,
) {
  constructor(
    configService: ConfigService,
    private readonly companyService: CompanyService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: ITokenPayload) {
    // payload.sub references the id of the company
    // console.log()
    return await this.companyService.getCompany(payload.sub, true);
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
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: ITokenPayload) {
    // payload.sub references the id of the entity
    return this.internService.getIntern(payload.sub, true);
  }
}
