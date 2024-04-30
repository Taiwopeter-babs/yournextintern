import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { exceptionHandler } from '../exceptions/exceptionHandler';
import { CompanyService } from '../company/company.service';
import Company from '../company/company.entity';
import { WrongCredentialsException } from '../exceptions/bad-request.exception';

import { JwtService } from '@nestjs/jwt';
import Intern from '../intern/intern.entity';
import { ITokenPayload } from '../lib/types';
import { CreateCompanyDto } from '../company/dto/createCompany.dto';
import { CreateInternDto } from '../intern/dto/createIntern.dto';
import { InternService } from '../intern/intern.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly companyService: CompanyService,
    private readonly internService: InternService,
    private readonly jwtService: JwtService,
  ) {}

  /** salt rounds to hash password with */
  private saltRounds = 10;

  public async validateCompany(email: string, hashedPassword: string) {
    try {
      const company = (await this.companyService.getCompanyByEmail(
        email,
        false,
      )) as Company;

      const isPasswordMatching = await this.verifyPassword(
        company.password,
        hashedPassword,
      );

      if (!isPasswordMatching) {
        throw new WrongCredentialsException();
      }

      return company;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async validateIntern(email: string, hashedPassword: string) {
    try {
      const intern = (await this.internService.getInternByEmail(
        email,
        false,
      )) as Intern;

      const isPasswordMatching = await this.verifyPassword(
        intern.password,
        hashedPassword,
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
   * Signs and returns an access token signed with the user's details - email and id
   */
  public async loginUser<T extends Company | Intern>(user: T) {
    const payload: ITokenPayload = { email: user.email, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    return accessToken;
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
