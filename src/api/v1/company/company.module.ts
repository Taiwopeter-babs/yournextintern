import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import Company from './company.entity';
import { AuthModule } from '../auth/auth.module';
import { InterncompanyModule } from '../interncompany/interncompany.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    AuthModule,
    InterncompanyModule,
  ],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
