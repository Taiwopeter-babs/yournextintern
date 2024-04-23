import { Controller } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('api/v1/companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}
}
