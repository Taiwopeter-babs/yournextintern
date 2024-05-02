import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import Company from './company.entity';
import CompanyDto from './dto/company.dto';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/createCompany.dto';
import DtoMapper from '../lib/mapper';

import { IPagination, PagedItemDto } from '../lib/types';
import getPaginationOffset from '../lib/pagination';

import { CompanyNotFoundException } from '../exceptions/not-found.exception';
import { CompanyAlreadyExistsException } from '../exceptions/bad-request.exception';
import { exceptionHandler } from '../exceptions/exceptionHandler';

import { InternCompanyService } from '../interncompany/interncompany.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
    private relationService: InternCompanyService,
  ) {}

  public async getAllCompanies(pageParams: IPagination): Promise<PagedItemDto> {
    return (await this.getPagedCompanies(pageParams)) as PagedItemDto;
  }

  public async getCompany(
    companyId: number,
    includeInterns: boolean,
  ): Promise<CompanyDto> {
    const company = (await this.getCompanyEntity(companyId)) as Company;

    if (includeInterns) {
      const interns =
        await this.relationService.getRelationsByCompany(companyId);

      return DtoMapper.toCompanyDto(company, includeInterns, interns);
    }

    return DtoMapper.toCompanyDto(company, includeInterns);
  }

  public async getCompanyByEmail(
    email: string,
    includeInterns: boolean,
  ): Promise<Company | void> {
    try {
      const company = await this.repo.findOne({
        where: { email: email },
        relations: { companyInterns: includeInterns },
      });

      if (!company) {
        throw new CompanyNotFoundException(email);
      }

      return company;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async createCompany(company: CreateCompanyDto) {
    try {
      const { name, email } = company;

      await this.checkCompanyExists({ name, email });

      const newCompany = await this.repo.save(company);

      return DtoMapper.toCompanyDto(newCompany, false);
    } catch (error) {
      console.error(error);
      exceptionHandler(error);
    }
  }

  public async updateCompany(companyId: number, data: UpdateCompanyDto) {
    try {
      await this.getCompanyEntity(companyId);

      await this.repo.update(companyId, { ...data });

      return true;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async deleteCompany(companyId: number) {
    (await this.getCompanyEntity(companyId)) as Company;

    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(Company)
        .where('id = :id', { id: companyId })
        .execute();
    } catch (error) {
      exceptionHandler(error);
    }
  }

  /**
   * Performs the check for any insertion to avoid duplicate entries
   */
  private async checkCompanyExists(data: {
    email: string;
    name: string;
  }): Promise<void> {
    try {
      const company = await this.repo.findOne({
        select: { id: true, name: true, email: true },
        // or query
        where: [
          { name: data.name.toLowerCase() },
          { email: data.email.toLowerCase() },
        ],
      });

      if (company) {
        throw new CompanyAlreadyExistsException(data.email);
      }
    } catch (error) {
      console.log(data);
      exceptionHandler(error);
    }
  }

  private async getPagedCompanies(
    pageParams: IPagination,
  ): Promise<PagedItemDto | void> {
    try {
      const pageOffset = getPaginationOffset(pageParams);

      const paginationOptions: FindManyOptions<Company> = {
        skip: pageOffset,
        take: pageParams.pageSize,
        order: { name: 'ASC' },
      };

      const [itemsCount, companies] = await Promise.all([
        // items count
        await this.repo.count(),
        // data
        await this.repo.find({ ...paginationOptions }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedItemDto = {
        companies: companies.map((com) => DtoMapper.toCompanyDto(com)),
        currentPage: pageParams.pageNumber,
        pageSize: pageParams.pageSize,
        totalPages: totalPages,
        totalItems: itemsCount,
        hasNext: pageParams.pageNumber < totalPages,
        hasPrevious: pageParams.pageNumber > 1,
      };

      return data;
    } catch (error) {
      exceptionHandler(error);
    }
  }

  private async getCompanyEntity(companyId: number): Promise<Company | void> {
    try {
      const company = await this.repo.findOne({
        where: { id: companyId },
        relations: { companyInterns: false },
      });

      if (!company) {
        throw new CompanyNotFoundException(companyId);
      }

      return company;
    } catch (error) {
      exceptionHandler(error);
    }
  }
}
