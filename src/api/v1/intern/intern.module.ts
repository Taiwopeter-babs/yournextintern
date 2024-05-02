import { Module } from '@nestjs/common';
import { InternService } from './intern.service';
import { InternController } from './intern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Intern from './intern.entity';
import { InterncompanyModule } from '../interncompany/interncompany.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Intern]),
    InterncompanyModule,
    CompanyModule,
  ],
  providers: [InternService],
  controllers: [InternController],
  exports: [InternService],
})
export class InternModule {}
