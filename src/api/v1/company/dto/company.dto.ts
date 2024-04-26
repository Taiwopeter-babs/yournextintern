import BaseDto from '../../lib/entities/baseDto';

export default class CompanyDto extends BaseDto {
  public name: string;

  public address: string;

  public website: string;

  public serviceType: string;

  public numberPositions: number;

  public applicationOpen: boolean;

  public companyInterns?: any[];
}
