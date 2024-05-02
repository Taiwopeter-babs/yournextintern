import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternCompany } from './internCompany.entity';
import { InternCompanyService } from './interncompany.service';
import Company from '../company/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InternCompany]),
    TypeOrmModule.forFeature([Company]),
  ],
  providers: [InternCompanyService],
  exports: [InternCompanyService],
})
export class InterncompanyModule {}
