import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { AuthService } from '../auth.service';
import Company from '../../company/company.entity';

import { ITokenPayload } from '../../lib/types';
import { CompanyService } from '../../company/company.service';

import { cookieExtractor } from './intern.strategy';
import { strategyConstants } from '../constants';

@Injectable()
export class CompanyLocalStrategy extends PassportStrategy(
  Strategy,
  strategyConstants.companyAuth,
) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email', // The email is read from the request body
    });
  }

  /** Populates the Request object with the company object */
  async validate(email: string, password: string): Promise<Company> {
    return (await this.authService.validateCompany(email, password)) as Company;
  }
}

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
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: ITokenPayload) {
    // payload.sub references the id of the company
    return this.companyService.getCompany(payload.sub, true);
  }
}
