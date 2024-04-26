import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternCompany } from './internCompany.entity';
import { Repository } from 'typeorm';
import { exceptionHandler } from '../exceptions/exceptionHandler';
import { RelationNotFoundException } from '../exceptions/not-found.exception';
import CompanyDto from '../company/dto/company.dto';
import InternDto from '../intern/dto/intern.dto';

@Injectable()
export class InternCompanyService {
  constructor(
    @InjectRepository(InternCompany)
    private repo: Repository<InternCompany>,
  ) {}

  public async saveRelation(internId: number, companyId: number) {
    try {
      // check for exsiting relation
      const relationExists = await this.checkRelation(internId, companyId);

      if (relationExists) return;

      const internCompanyObj: InternCompany = new InternCompany();

      internCompanyObj.companyId = companyId;
      internCompanyObj.internId = internId;

      await this.repo.save(internCompanyObj);
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

  public async getRelationsByCompany(companyId: number) {
    try {
      const interns = await this.repo
        .createQueryBuilder('intcom')
        .leftJoinAndSelect('intcom.intern', 'intern')
        .where('intcom.companyId = :id', { id: companyId })
        .getMany();

      console.log(interns);

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

  public async getRelationsByIntern(internId: number) {
    try {
      const companies = await this.repo
        .createQueryBuilder('intcom')
        .leftJoinAndSelect('intcom.company', 'company')
        .where('intcom.internId = :id', { id: internId })
        .getMany();

      console.log(companies);

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

      console.log(relationObj);

      if (relationObj) return true;

      return false;
    } catch (error) {
      exceptionHandler(error);
    }
  }
}
