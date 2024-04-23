import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinDate,
} from 'class-validator';

import { Gender } from '../intern.entity';

export default class CreateInternDto {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;

  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 8 })
  public password: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: string;

  @IsDate()
  @MinDate(new Date('2006-01-01T03:24:00'))
  public birthday?: string;

  @IsNotEmpty()
  @IsString()
  public school: string;

  @IsOptional()
  @IsString()
  public phone?: string;

  @IsOptional()
  @IsBoolean()
  public applicationOpen?: boolean;
}
