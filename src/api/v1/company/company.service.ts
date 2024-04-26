import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import Company from './company.entity';
import CompanyDto from './dto/company.dto';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/createCompany.dto';
import DtoMapper from '../lib/mapper';

import { IPagination } from '../lib/types';
import getPaginationOffset from '../lib/pagination';

import { CompanyNotFoundException } from '../exceptions/not-found.exception';
import { CompanyAlreadyExistsException } from '../exceptions/already-exists.exception';
import { exceptionHandler } from '../exceptions/exceptionHandler';

import { AuthService } from '../auth/auth.service';
import { InternCompanyService } from '../interncompany/interncompany.service';

type PagedCompanyDto = {
  companies: CompanyDto[];
  hasPrevious: boolean;
  hasNext: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private repo: Repository<Company>,
    private authService: AuthService,
    private relationService: InternCompanyService,
  ) {}

  public async getAllCompanies(
    pageParams: IPagination,
  ): Promise<PagedCompanyDto> {
    return (await this.getPagedCompanies(pageParams)) as PagedCompanyDto;
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
  ): Promise<CompanyDto | void> {
    try {
      const company = await this.repo.findOneBy({ email: email });
      if (!company) {
        throw new CompanyNotFoundException(email);
      }

      return DtoMapper.toCompanyDto(company, includeInterns);
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async createCompany(company: CreateCompanyDto) {
    try {
      const { name, email, password } = company;

      await this.checkCompanyExists({ name, email });

      company.password = (await this.authService.hashPassword(
        password,
      )) as string;

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
      exceptionHandler(error, companyId);
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
      // console.log(error);
      throw error;
      // exceptionHandler(error, data.email);
    }
  }

  private async getPagedCompanies(
    pageParams: IPagination,
  ): Promise<PagedCompanyDto | void> {
    try {
      const pageOffset = getPaginationOffset(pageParams);

      const [itemsCount, companies] = await Promise.all([
        // items count
        await this.repo.count(),
        // data
        await this.repo.find({
          skip: pageOffset,
          take: pageParams.pageSize,
          order: { name: 'ASC' },
        }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedCompanyDto = {
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
      exceptionHandler(error, companyId);
    }
  }
}
