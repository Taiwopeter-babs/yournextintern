import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { IPagination } from '../lib/types';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/createCompany.dto';

@Controller('companies')
export class CompanyController {
  constructor(private readonly _service: CompanyService) {}

  @Get()
  public async getAllCompanies(
    @Query('pageNumber', ParseIntPipe) pageNumber: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ) {
    const pageParams = { pageNumber, pageSize } as IPagination;

    const companiesData = await this._service.getAllCompanies(pageParams);

    return { statusCode: 200, ...companiesData };
  }

  @Post()
  public async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this._service.createCompany(createCompanyDto);

    return company;
  }

  @Get(':id')
  public async getCompany(@Param('id') id: number) {
    const company = await this._service.getCompany(id, true);

    return { statusCode: 200, ...company };
  }

  @Put(':id')
  @HttpCode(204)
  public async updateCompany(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    await this._service.updateCompany(id, updateCompanyDto, false);

    return {};
  }
}
