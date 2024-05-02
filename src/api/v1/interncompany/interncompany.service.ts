import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternCompany } from './internCompany.entity';
import { In, Repository } from 'typeorm';

import { exceptionHandler } from '../exceptions/exceptionHandler';
import { RelationNotFoundException } from '../exceptions/not-found.exception';
import CompanyDto from '../company/dto/company.dto';
import InternDto from '../intern/dto/intern.dto';
import Company from '../company/company.entity';

@Injectable()
export class InternCompanyService {
  constructor(
    @InjectRepository(InternCompany)
    private repo: Repository<InternCompany>,
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
  ) {}

  /**
   *
   * @param internId id of intern
   * @param idsOfCompanies ids of companies - companies previously registered to an intern
   * and non-existing companies will be excluded from the creation process.
   */
  public async createRelation(internId: number, idsOfCompanies: number[]) {
    try {
      // console.log(idsOfCompanies);
      const linkedCompanies = await this.repo.find({
        where: {
          internId: internId,
          companyId: In([...idsOfCompanies]),
        },
      });

      console.log(linkedCompanies);

      const linkedCompaniesIds = linkedCompanies.map(
        (entity) => entity.companyId,
      );

      const companiesIdsNotLinked = idsOfCompanies.filter(
        (id) => linkedCompaniesIds.indexOf(id) === -1,
      );

      console.log(companiesIdsNotLinked);

      const availableCompanies = await this.companyRepo.find({
        where: {
          id: In([...companiesIdsNotLinked]),
        },
      });

      // create an array of InternCompany entities
      const arrayInternCompanies = availableCompanies.map((com) => {
        const internCompanyObj = new InternCompany();

        internCompanyObj.companyId = com.id;
        internCompanyObj.internId = internId;

        return internCompanyObj;
      });

      await this.repo.save(arrayInternCompanies);

      console.log(availableCompanies);
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async deleteRelation(companyId: number, internId: number) {
    try {
      const relationObj = await this.repo.findOneBy({
        companyId: companyId,
        internId: internId,
      });

      if (!relationObj)
        throw new RelationNotFoundException({ internId, companyId });

      await this.repo
        .createQueryBuilder()
        .delete()
        .from(InternCompany)
        .where('internId = :inId', { inId: internId })
        .andWhere('companyId = :comId', { comId: companyId })
        .execute();
    } catch (error) {
      exceptionHandler(error);
    }
  }

  /**
   * Get all interns linked to a company
   */
  public async getRelationsByCompany(companyId: number) {
    try {
      const interns = await this.repo
        .createQueryBuilder('intcom')
        .leftJoinAndSelect('intcom.intern', 'intern')
        .where('intcom.companyId = :id', { id: companyId })
        .getMany();

      const companyInterns = interns.map((intcom) => {
        const obj = intcom.intern as InternDto;
        delete obj.password;
        return obj;
      });

      return companyInterns;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Get all companies linked to an intern
   */
  public async getRelationsByIntern(internId: number) {
    try {
      const companies = await this.repo
        .createQueryBuilder('intcom')
        .leftJoinAndSelect('intcom.company', 'company')
        .where('intcom.internId = :id', { id: internId })
        .getMany();

      const internCompanies = companies.map((intcom) => {
        const obj = intcom.company as CompanyDto;
        delete obj.password;
        return obj;
      });

      return internCompanies;
    } catch (error) {
      console.error(error);
    }
  }

  /** Check if the intern is linked to a company */
  private async checkRelation(internId: number, companyId: number) {
    try {
      const relationObj = await this.repo.findOneBy({
        companyId: companyId,
        internId: internId,
      });

      return relationObj ? true : false;
    } catch (error) {
      exceptionHandler(error);
    }
  }
}
