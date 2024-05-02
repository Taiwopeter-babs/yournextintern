import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

class BaseCompanyDto {
  @IsNotEmpty()
  public name: string;

  @IsNotEmpty()
  public address: string;

  @IsOptional()
  public website?: string;

  @IsNotEmpty()
  public serviceType: string;

  @IsOptional()
  @IsInt()
  public numberPositions?: number;

  @IsOptional()
  @IsBoolean()
  public applicationOpen?: boolean;
}

/** Dto for company creation */
export class CreateCompanyDto extends BaseCompanyDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;
}

/** Dto for company login */
export class LoginCompanyDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;
}

/** Dto for company update. All properties are optional */
export class UpdateCompanyDto extends PartialType(BaseCompanyDto) {}
