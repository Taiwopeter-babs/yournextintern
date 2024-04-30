import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { CreateCompanyDto } from '../company/dto/createCompany.dto';

import { AuthService } from './auth.service';
import { LocalCompanyAuthGuard, LocalInternAuthGuard } from './auth.guards';
import { CompanyService } from '../company/company.service';
import Company from '../company/company.entity';
import { strategyConstants } from './constants';

import DtoMapper from '../lib/mapper';
import CompanyDto from '../company/dto/company.dto';
import { CreateInternDto } from '../intern/dto/createIntern.dto';
import { InternService } from '../intern/intern.service';
import InternDto from '../intern/dto/intern.dto';
import Intern from '../intern/intern.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _service: AuthService,
    private readonly companyService: CompanyService,
    private readonly configService: ConfigService,
    private readonly internService: InternService,
  ) {}

  @Post('companies/register')
  public async registerCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const company = (await this.companyService.createCompany(
      createCompanyDto,
    )) as CompanyDto;

    return {
      statusCode: HttpStatus.OK,
      message: 'Registration successful',
      ...company,
    };
  }

  @Post('interns/register')
  public async registerIntern(@Body() createInternDto: CreateInternDto) {
    const intern = (await this.internService.createIntern(
      createInternDto,
    )) as InternDto;

    return {
      statusCode: HttpStatus.OK,
      message: 'Registration successful',
      ...intern,
    };
  }

  @HttpCode(200)
  @UseGuards(LocalCompanyAuthGuard)
  @Post('companies/login')
  public async loginCompany(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // from auth validate strategy: CompanyLocalStrategy
    const company = request.user as Company;

    const cookie = await this._service.loginUser(company);

    const cookieOptions: CookieOptions = {
      maxAge: this.configService.get('JWT_VALID_TIME'),
      httpOnly: true,
    };

    // set payload for cookie
    response.cookie(strategyConstants.cookieName, cookie, cookieOptions);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      ...DtoMapper.toCompanyDto(company),
    };
  }

  @HttpCode(200)
  @UseGuards(LocalInternAuthGuard)
  @Post('interns/login')
  public async loginIntern(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // from auth validate strategy: CompanyLocalStrategy
    const intern = request.user as Intern;

    const cookie = await this._service.loginUser(intern);

    const cookieOptions: CookieOptions = {
      maxAge: this.configService.get('JWT_VALID_TIME'),
      httpOnly: true,
    };

    // set payload for cookie
    response.cookie(strategyConstants.cookieName, cookie, cookieOptions);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      ...DtoMapper.toInternDto(intern),
    };
  }
}
