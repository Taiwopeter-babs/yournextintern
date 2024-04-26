import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  // Query,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { IPagination } from '../lib/types';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/createCompany.dto';
import { Request } from 'express';

@Controller('companies')
export class CompanyController {
  constructor(private readonly _service: CompanyService) {}

  @Get()
  public async getAllCompanies(@Req() request: Request) {
    const { pageNumber, pageSize } = request.query as Record<string, any>;

    const pageParams = {
      pageNumber: parseInt(pageNumber, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 20,
    } as IPagination;

    const companiesData = await this._service.getAllCompanies(pageParams);

    return { statusCode: 200, ...companiesData };
  }

  @Post()
  public async createCompany(@Body() createCompanyDto: CreateCompanyDto) {
    const company = await this._service.createCompany(createCompanyDto);

    return company;
  }

  @Get(':id')
  public async getCompany(@Param('id', ParseIntPipe) id: number) {
    const company = await this._service.getCompany(id, true);

    return { statusCode: 200, ...company };
  }

  @Put(':id')
  @HttpCode(204)
  public async updateCompany(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    await this._service.updateCompany(id, updateCompanyDto);

    return {};
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteCompany(@Param('id', ParseIntPipe) id: number) {
    await this._service.deleteCompany(id);
    return {};
  }
}
