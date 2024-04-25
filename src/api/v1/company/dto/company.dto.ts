import InternDto from '../../intern/dto/intern.dto';

export default class CompanyDto {
  public id: number;

  public name: string;

  public email: string;

  public address: string;

  public website: string;

  public serviceType: string;

  public availablePositions: number;

  public applicationOpen: boolean;

  public createdAt: Date;

  public updatedAt: Date;

  public profileImageUrl?: string;

  public interns?: InternDto[];
}
