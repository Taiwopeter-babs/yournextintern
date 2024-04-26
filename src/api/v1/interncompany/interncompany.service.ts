import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InternCompany } from './internCompany.entity';
import { Repository } from 'typeorm';
import { exceptionHandler } from '../exceptions/exceptionHandler';
import { RelationNotFoundException } from '../exceptions/not-found.exception';

@Injectable()
export class InternCompanyService {
  constructor(
    @InjectRepository(InternCompany)
    private repo: Repository<InternCompany>,
  ) {}

  public async saveRelation(companyId: number, internId: number) {
    try {
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
    const interns = await this.repo
      .createQueryBuilder('internCompany')
      .leftJoinAndSelect(
        'interns',
        'intern',
        'intern.id = internCompany.internId',
      )
      .where('internCompany.companyId = :id', { id: companyId })
      .getMany();

    const sql = this.repo
      .createQueryBuilder('internCompany')
      .leftJoinAndSelect(
        'interns',
        'intern',
        'intern.id = internCompany.internId',
      )
      .where('internCompany.companyId = :id', { id: companyId })
      .getQuery();
    console.log(sql);
    console.log(interns);

    // return interns;
  }

  public async getRelationsByIntern(internId: number) {
    const interns = await this.repo
      .createQueryBuilder('internCompany')
      .leftJoinAndSelect(
        'companies',
        'company',
        'company.id = internCompany.companyId',
      )
      .where('internCompany.internId = :id', { id: internId })
      .getMany();

    const sql = this.repo
      .createQueryBuilder('internCompany')
      .leftJoinAndSelect(
        'companies',
        'company',
        'company.id = internCompany.companyId',
      )
      .where('internCompany.companyId = :id', { id: internId })
      .getQuery();
    console.log(sql);
    console.log(interns);
  }
}
