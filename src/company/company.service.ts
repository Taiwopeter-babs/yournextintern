import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Company from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyDto from './dto/company.dto';
import { IPagination } from 'src/lib/types';
import getPaginationOffset from 'src/lib/pagination';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
  ) {}

  public async getAll(pageParams: IPagination): Promise<CompanyDto[]> {
    try {
      const pageOffset = getPaginationOffset(pageParams);

      const allCompanies = await this.repo
        .find({ skip: pageOffset, take: pageParams.pageSize })
        .then((companies) => companies.map((com) => com.ToDto(com)));

      return allCompanies;
    } catch (error) {
      throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
