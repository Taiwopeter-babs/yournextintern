import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';

import {
  CreateInternDto,
  UpdateInternDto,
} from '../intern/dto/createIntern.dto';

import { InternAlreadyExistsException } from '../exceptions/already-exists.exception';
import { exceptionHandler } from '../exceptions/exceptionHandler';
import { InternNotFoundException } from '../exceptions/not-found.exception';

import getPaginationOffset from '../lib/pagination';
import { IPagination } from '../lib/types';
import Intern from './intern.entity';
import { InternMapper } from './dto/mapper';
import InternDto from './dto/intern.dto';
import { InternCompanyService } from '../interncompany/interncompany.service';

type PagedInternDto = {
  interns: InternDto[];
  hasPrevious: boolean;
  hasNext: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};

@Injectable()
export class InternService {
  constructor(
    @InjectRepository(Intern)
    private repo: Repository<Intern>,
    private authService: AuthService,
    private relationService: InternCompanyService,
  ) {}

  public async getAllInterns(pageParams: IPagination): Promise<PagedInternDto> {
    return (await this.getPagedInterns(pageParams)) as PagedInternDto;
  }

  public async getIntern(
    internId: number,
    includeCompanies: boolean,
  ): Promise<InternDto> {
    const intern = (await this.getInternEntity(internId)) as Intern;

    return InternMapper.toDto(intern, includeCompanies);
  }

  public async getInternByEmail(
    email: string,
    includeCompanies: boolean,
  ): Promise<InternDto | void> {
    try {
      const intern = await this.repo.findOneBy({ email: email });
      if (!intern) {
        throw new InternNotFoundException(email);
      }

      return InternMapper.toDto(intern, includeCompanies);
    } catch (error) {
      exceptionHandler(error);
    }
  }

  public async createIntern(intern: CreateInternDto) {
    try {
      const { email, password } = intern;

      await this.checkInternExists(email);

      intern.password = (await this.authService.hashPassword(
        password,
      )) as string;

      const newIntern = await this.repo.save(intern);

      return InternMapper.toDto(newIntern, false);
    } catch (error) {
      console.error(error);
      exceptionHandler(error);
    }
  }

  public async updateIntern(internId: number, data: UpdateInternDto) {
    try {
      await this.getInternEntity(internId);

      await this.repo.update(internId, { ...data });

      return true;
    } catch (error) {
      exceptionHandler(error, internId);
    }
  }

  public async deleteIntern(internId: number) {
    (await this.getInternEntity(internId)) as Intern;

    try {
      await this.repo
        .createQueryBuilder()
        .delete()
        .from(Intern)
        .where('id = :id', { id: internId })
        .execute();
    } catch (error) {
      exceptionHandler(error);
    }
  }

  /**
   * Performs the check for any insertion to avoid duplicate entries
   */
  private async checkInternExists(email: string): Promise<void> {
    try {
      const intern = await this.repo.findOne({
        select: { id: true, email: true },
        // or query
        where: { email: email.toLowerCase() },
      });

      if (intern) {
        throw new InternAlreadyExistsException(email);
      }
    } catch (error) {
      exceptionHandler(error, email);
    }
  }

  private async getPagedInterns(
    pageParams: IPagination,
  ): Promise<PagedInternDto | void> {
    try {
      const pageOffset = getPaginationOffset(pageParams);

      const [itemsCount, interns] = await Promise.all([
        // items count
        await this.repo.count(),
        // data
        await this.repo.find({
          skip: pageOffset,
          take: pageParams.pageSize,
          order: { firstName: 'ASC' },
        }),
      ]);

      const totalPages = Math.ceil(itemsCount / pageParams.pageSize);

      const data: PagedInternDto = {
        interns: interns.map((intern) => InternMapper.toDto(intern)),
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

  private async getInternEntity(internId: number): Promise<Intern | void> {
    try {
      const intern = await this.repo.findOne({
        where: { id: internId },
        relations: { internCompanies: false },
      });

      await this.relationService.getRelationsByIntern(internId);

      if (!intern) {
        throw new InternNotFoundException(internId);
      }

      return intern;
    } catch (error) {
      exceptionHandler(error, internId);
    }
  }
}
