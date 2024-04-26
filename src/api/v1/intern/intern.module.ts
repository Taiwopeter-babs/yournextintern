import { Module } from '@nestjs/common';
import { InternService } from './intern.service';
import { InternController } from './intern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Intern from './intern.entity';
import { AuthModule } from '../auth/auth.module';
import { InterncompanyModule } from '../interncompany/interncompany.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Intern]),
    AuthModule,
    InterncompanyModule,
  ],
  providers: [InternService],
  controllers: [InternController],
  exports: [InternService],
})
export class InternModule {}
