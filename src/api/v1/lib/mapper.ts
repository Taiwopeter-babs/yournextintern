import Company from '../company/company.entity';
import CompanyDto from '../company/dto/company.dto';
import Intern from '../intern/intern.entity';
import InternDto from '../intern/dto/intern.dto';

/**
 * Maps entity from and to the Dto and Company class
 */
export default class DtoMapper {
  public static toCompanyDto(
    entity: Company,
    includeRelations = false,
    entities: Array<InternDto> | undefined = [],
  ): CompanyDto {
    const dtoObj = { ...entity } as CompanyDto;

    if (includeRelations) {
      dtoObj.companyInterns = entities;
    }

    delete dtoObj.password;

    return dtoObj;
  }

  public static toInternDto(
    entity: Intern,
    includeRelations = false,
    entities: Array<CompanyDto> | undefined = [],
  ): InternDto {
    const dtoObj = { ...entity } as InternDto;

    if (includeRelations) {
      dtoObj.internCompanies = entities;
    }

    delete dtoObj.password;

    return dtoObj;
  }
}
