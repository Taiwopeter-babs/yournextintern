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
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { IPagination } from '../lib/types';
import { InternService } from './intern.service';
import { CreateInternDto, UpdateInternDto } from './dto/createIntern.dto';

@Controller('interns')
export class InternController {
  constructor(private readonly _service: InternService) {}

  @Get()
  public async getAllInterns(@Req() request: Request) {
    const { pageNumber, pageSize } = request.query as Record<string, any>;

    const pageParams = {
      pageNumber: parseInt(pageNumber, 10) || 1,
      pageSize: parseInt(pageSize, 10) || 20,
    } as IPagination;

    const internsData = await this._service.getAllInterns(pageParams);

    return { statusCode: 200, ...internsData };
  }

  @Post()
  public async createIntern(@Body() createInternDto: CreateInternDto) {
    const intern = await this._service.createIntern(createInternDto);

    return intern;
  }

  @Get(':id')
  public async getCompany(@Param('id', ParseIntPipe) id: number) {
    const intern = await this._service.getIntern(id, true);

    return { statusCode: 200, ...intern };
  }

  @Put(':id')
  @HttpCode(204)
  public async updateIntern(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInternDto: UpdateInternDto,
  ) {
    await this._service.updateIntern(id, updateInternDto);

    return {};
  }

  @Delete(':id')
  @HttpCode(204)
  public async deleteIntern(@Param('id', ParseIntPipe) id: number) {
    await this._service.deleteIntern(id);
    return {};
  }

  @Post(':id/companies/:companyId')
  @HttpCode(200)
  public async registerCompanyToIntern(
    @Param('id', ParseIntPipe) id: number,
    @Param('companyId', ParseIntPipe) companyId: number,
  ) {
    await this._service.registerCompanyToIntern(id, companyId);
    return {
      statusCode: 200,
      message: 'Company has been successfully registered to intern',
    };
  }
}
