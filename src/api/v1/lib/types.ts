import CompanyDto from '../company/dto/company.dto';
import InternDto from '../intern/dto/intern.dto';

export interface ICorsConfig {
  methods: string | string;
  origin: string | string[];
}

export interface IPagination {
  pageNumber: number;
  pageSize: number;
}

export type TEntity = 'Company' | 'Intern';
export interface ITokenPayload {
  email: string;
  entityType: TEntity;
  sub: number;
}

export type PagedItemDto = {
  [index: string]: InternDto[] | CompanyDto[] | boolean | number;
  hasPrevious: boolean;
  hasNext: boolean;
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
};
