import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

import { Gender } from '../intern.entity';
import { PartialType } from '@nestjs/mapped-types';

class BaseInternDto {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  public gender: Gender;

  @IsDateString()
  // @MaxDate(new Date('2006-01-01'))
  public birthday: string;

  @IsNotEmpty()
  @IsString()
  public school: string;

  @IsNotEmpty()
  @IsString()
  public course: string;

  @IsString()
  @Length(10)
  public phone: string;
}

/** Dto for intern creation */
export class CreateInternDto extends BaseInternDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  // @IsStrongPassword({ minLength: 8 })
  public password: string;
}

/** Dto for intern update. All properties are optional */
export class UpdateInternDto extends PartialType(BaseInternDto) {}

export class InternCompaniesDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({ allowNaN: false }, { each: true })
  companies: number[];
}
