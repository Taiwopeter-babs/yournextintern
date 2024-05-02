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

import { CreateCompanyDto } from '../company/dto/createCompany.dto';

import { AuthService } from './auth.service';
import { LocalCompanyAuthGuard, LocalInternAuthGuard } from './auth.guards';
import Company from '../company/company.entity';
import { strategyConstants } from './constants';

import DtoMapper from '../lib/mapper';
import CompanyDto from '../company/dto/company.dto';
import { CreateInternDto } from '../intern/dto/createIntern.dto';
import InternDto from '../intern/dto/intern.dto';
import Intern from '../intern/intern.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly _service: AuthService) {}

  @Post('companies/register')
  public async registerCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const company = (await this._service.registerCompany(
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
    const intern = (await this._service.registerIntern(
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
    // from authentication validate strategy: CompanyLocalStrategy
    const company = request.user as Company;

    const [cookieOptions, accessToken] = (await this._service.loginUser(
      company,
      'Company',
    )) as [CookieOptions, string];

    // set payload for cookie
    response.cookie(strategyConstants.cookieName, accessToken, cookieOptions);

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
    // from authentication validate strategy: InternLocalStrategy
    const intern = request.user as Intern;

    const [cookieOptions, accessToken] = (await this._service.loginUser(
      intern,
      'Intern',
    )) as [CookieOptions, string];

    // set payload for cookie
    response.cookie(strategyConstants.cookieName, accessToken, cookieOptions);

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      ...DtoMapper.toInternDto(intern),
    };
  }
}
