import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export default class CreateCompanyDto {
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  public email: string;

  @IsNotEmpty()
  public password: string;

  @IsNotEmpty()
  public address: string;

  @IsOptional()
  public website?: string;

  @IsNotEmpty()
  public serviceType: string;

  @IsOptional()
  @IsInt()
  public availablePositions?: number;

  @IsOptional()
  @IsBoolean()
  public applicationOpen?: boolean;
}
