import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import Company from './company.entity';
import { InjectRepository } from '@nestjs/typeorm';
import CompanyDto from './dto/company.dto';
import { IPagination } from 'src/lib/types';
import getPaginationOffset from 'src/lib/pagination';
import { CompanyNotFoundException } from 'src/exceptions/not-found.exception';
import { ServerErrorException } from 'src/exceptions/server-error.exception';
import { CompanyMapper } from './dto/mapper';
import CreateCompanyDto from './dto/createCompany.dto';

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
        .then((companies) => companies.map((com) => CompanyMapper.toDto(com)));

      return allCompanies;
    } catch (error) {
      throw new ServerErrorException();
    }
  }

  public async getCompany(
    companyId: number,
    includeInterns: boolean,
  ): Promise<CompanyDto> {
    try {
      const company = await this.repo.findOneBy({ id: companyId });
      if (!company) {
        throw new CompanyNotFoundException(companyId);
      }

      return CompanyMapper.toDto(company, includeInterns);
    } catch (error) {
      throw new ServerErrorException();
    }
  }

  public async getCompanyByEmail(
    email: string,
    includeInterns: boolean,
  ): Promise<CompanyDto> {
    try {
      const company = await this.repo.findOneBy({ email: email });
      if (!company) {
        throw new CompanyNotFoundException(email);
      }

      return CompanyMapper.toDto(company, includeInterns);
    } catch (error) {
      throw new ServerErrorException();
    }
  }

  public async createCompany(data: CreateCompanyDto) {
    try {
      const newCompany = await this.repo.save(data);
    } catch (error) {
      throw new ServerErrorException();
    }
  }

  private async checkCompanyExists(
    data: { email: string; name: string },
    includeInterns: boolean,
  ): Promise<CompanyDto> {
    try {
      const company = await this.repo.findOne({
        select: { id: true, name: true, email: true },
        where: [{ name: data.name }, {}],
      });

      if (!company) {
        throw new CompanyNotFoundException(companyEmail);
      }

      return CompanyMapper.toDto(company, includeInterns);
    } catch (error) {
      throw new ServerErrorException();
    }
  }
}
