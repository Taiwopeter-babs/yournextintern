import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { strategyConstants } from './constants';

/** This guard uses the CompanyAuthStrategy to validate a company */
@Injectable()
export class LocalCompanyAuthGuard extends AuthGuard(
  strategyConstants.companyAuth,
) {}

/** This guard uses the InternAuthStrategy */
@Injectable()
export class LocalInternAuthGuard extends AuthGuard(
  strategyConstants.internAuth,
) {}

/**
 * Different auth guards are configured for company and intern because of the
 * logical differences in the passport validate method
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard(strategyConstants.jwt) {}
