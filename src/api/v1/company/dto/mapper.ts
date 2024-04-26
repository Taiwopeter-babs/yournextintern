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

    // const interns = [];

    dtoObj.interns = entity.internCompanies?.map((en) => en.internId);

    delete dtoObj.password;

    if (!includeInterns) {
      delete dtoObj.interns;
    }
    // transform interns
    return dtoObj;
  }
}
