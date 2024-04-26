import Intern from '../intern.entity';

import InternDto from './intern.dto';
// import CreateCompanyDto from './createCompany.dto';
// import InternDto from 'src/intern/dto/intern.dto';

/**
 * Maps entity from and to the Dto and Company class
 */
export class InternMapper {
  public static toDto(entity: Intern, includeInterns = false) {
    const dtoObj: InternDto = Object.assign({}, entity);

    // const interns = [];

    dtoObj.companies = entity.internCompanies?.map((en) => en.internId);

    delete dtoObj.password;

    if (!includeInterns) {
      delete dtoObj.companies;
    }
    // transform interns
    return dtoObj;
  }
}
