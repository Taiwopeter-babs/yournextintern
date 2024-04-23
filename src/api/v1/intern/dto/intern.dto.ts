import CompanyDto from 'src/api/v1/company/dto/company.dto';

export default class InternDto {
  public id: string;

  public firstName: string;

  public lastName: string;

  public email: string;

  public gender: string;

  public birthday: Date;

  public school: string;

  public phone: string;

  public course: string;

  public numberOfApplications: string;

  public createdAt: Date;

  public updatedAt: Date;

  public profileImageUrl?: string;

  public companies?: CompanyDto[];
}
