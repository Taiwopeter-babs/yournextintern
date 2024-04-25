import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Company from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyDto from './dto/company.dto';
import { IPagination } from '../lib/types';
import getPaginationOffset from '../lib/pagination';
import { CompanyNotFoundException } from '../exceptions/not-found.exception';
import { CompanyMapper } from './dto/mapper';
import { CreateCompanyDto, UpdateCompanyDto } from './dto/createCompany.dto';
import { CompanyAlreadyExistsException } from '../exceptions/already-exists.exception';
import { exceptionHandler } from '../exceptions/exceptionHandler';

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
    const company = (await this.getCompanyEntity(
      companyId,
      includeInterns,
    )) as Company;

    return CompanyMapper.toDto(company, includeInterns);
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

      return CompanyMapper.toDto(company, includeInterns);
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async createCompany(company: CreateCompanyDto) {
    try {
      const data = { name: company.name, email: company.email };
      await this.checkCompanyExists(data);

      const newCompany = await this.repo.save(company);

      return CompanyMapper.toDto(newCompany, false);
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async updateCompany(
    companyId: number,
    data: UpdateCompanyDto,
    includeInterns = false,
  ) {
    try {
      await this.getCompanyEntity(companyId, includeInterns);

      await this.repo.update(companyId, { ...data });

      return true;
    } catch (error) {
      exceptionHandler(error, companyId);
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

      return;
    } catch (error) {
      exceptionHandler(error, data.email);
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
        companies: companies.map((com) => CompanyMapper.toDto(com)),
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

  private async getCompanyEntity(
    companyId: number,
    includeInterns = false,
  ): Promise<Company | void> {
    try {
      const company = await this.repo.findOne({
        where: { id: companyId },
        relationLoadStrategy: 'query', // use split queries
        relations: { internCompanies: includeInterns },
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
