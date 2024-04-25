import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternCompany } from '../lib/entities/internCompany.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InternCompany])],
})
export class InterncompanyModule {}
