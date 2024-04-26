import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternCompany } from './internCompany.entity';
import { InternCompanyService } from './interncompany.service';

@Module({
  imports: [TypeOrmModule.forFeature([InternCompany])],
  providers: [InternCompanyService],
  exports: [InternCompanyService],
})
export class InterncompanyModule {}
