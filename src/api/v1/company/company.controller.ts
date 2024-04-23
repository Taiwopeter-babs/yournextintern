import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { IPagination } from '../lib/types';

@Controller('companies')
export class CompanyController {
  constructor(private _service: CompanyService) {}

  @Get()
  public async getAllCompanies(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const pageParams = { pageNumber, pageSize } as IPagination;

    const companies = this._service.getAllCompanies(pageParams);

    return companies;
  }
}
