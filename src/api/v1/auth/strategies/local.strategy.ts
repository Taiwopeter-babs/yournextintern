import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { strategyConstants } from '../constants';

import Company from '../../company/company.entity';
import Intern from '../../intern/intern.entity';

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
