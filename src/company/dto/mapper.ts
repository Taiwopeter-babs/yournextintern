import Company from '../company.entity';
import CompanyDto from './company.dto';
// import CreateCompanyDto from './createCompany.dto';
// import InternDto from 'src/intern/dto/intern.dto';

/**
 * Maps entity from and to the Dto and Company class
 */
export class CompanyMapper {
  public static toDto(entity: Company, includeInterns = false) {
    const dtoObj: CompanyDto = Object.assign({}, entity);

    if (!includeInterns) {
      delete dtoObj.interns;
    }
    // transform interns
    return dtoObj;
  }

  // public static toEntity<T>(dto: T): Company {
  //   const dtoObj = Object.assign({}, dto);

  //   // transform interns
  //   return dtoObj as unknown as Company;
  // }
}
