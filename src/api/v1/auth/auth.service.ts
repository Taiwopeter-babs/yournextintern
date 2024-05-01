import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { exceptionHandler } from '../exceptions/exceptionHandler';
import { CompanyService } from '../company/company.service';
import Company from '../company/company.entity';
import { WrongCredentialsException } from '../exceptions/bad-request.exception';

import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import Intern from '../intern/intern.entity';
import { ITokenPayload } from '../lib/types';
import { CreateCompanyDto } from '../company/dto/createCompany.dto';
import { CreateInternDto } from '../intern/dto/createIntern.dto';
import { InternService } from '../intern/intern.service';
import { ConfigService } from '@nestjs/config';
import { CookieOptions } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly internService: InternService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** salt rounds to hash password with */
  private saltRounds = 10;

  public async validateCompany(email: string, password: string) {
    try {
      const company = (await this.companyService.getCompanyByEmail(
        email,
        false,
      )) as Company;

      const isPasswordMatching = await this.verifyPassword(
        password,
        company.password,
      );

      if (!isPasswordMatching) {
        throw new WrongCredentialsException();
      }

      return company;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async validateIntern(email: string, password: string) {
    try {
      const intern = (await this.internService.getInternByEmail(
        email,
        false,
      )) as Intern;

      const isPasswordMatching = await this.verifyPassword(
        password,
        intern.password,
      );

      if (!isPasswordMatching) {
        throw new WrongCredentialsException();
      }

      return intern;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  /**
   * Signs and returns an access token and cookie options for session
   */
  public async loginUser<T extends Company | Intern>(user: T) {
    const payload: ITokenPayload = { email: user.email, sub: user.id };

    const validTime = this.configService.get('JWT_VALID_TIME') as string;
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    const jwtSignOptions: JwtSignOptions = {
      expiresIn: parseInt(validTime, 10),
      secret: jwtSecret,
    };

    const accessToken = await this.jwtService.signAsync(
      payload,
      jwtSignOptions,
    );

    const cookieOptions: CookieOptions = {
      maxAge: parseInt(validTime, 10) * 1000,
      httpOnly: true,
    };

    return [cookieOptions, accessToken];
  }

  /**
   * ### verifies a password
   */
  private async verifyPassword(password: string, hash: string) {
    try {
      const isVerified = await bcrypt.compare(password, hash);
      return isVerified;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  /**
   * ### hashes a user password
   */
  public async hashPassword(password: string) {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async registerCompany(company: CreateCompanyDto) {
    try {
      const { password } = company;

      company.password = (await this.hashPassword(password)) as string;

      return this.companyService.createCompany(company);
    } catch (error) {
      console.error(error);
      exceptionHandler(error);
    }
  }

  public async registerIntern(intern: CreateInternDto) {
    try {
      const { password } = intern;

      intern.password = (await this.hashPassword(password)) as string;

      return this.internService.createIntern(intern);
    } catch (error) {
      console.error(error);
      exceptionHandler(error);
    }
  }
}
