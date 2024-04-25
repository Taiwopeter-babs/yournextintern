import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternCompany } from './internCompany.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InternCompany])],
})
export class InterncompanyModule {}
