import Company from '../company.entity';
import CompanyDto from './company.dto';
// import InternDto from 'src/intern/dto/intern.dto';

Company.prototype.ToDto = function (entity: Company) {
  const dtoObj: CompanyDto = Object.assign({}, entity);
  delete dtoObj.interns;
  return dtoObj;
};
