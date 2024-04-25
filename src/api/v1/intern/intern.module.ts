import { Module } from '@nestjs/common';
import { InternService } from './intern.service';
import { InternController } from './intern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Intern from './intern.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Intern])],
  providers: [InternService],
  controllers: [InternController],
  exports: [InternService],
})
export class InternModule {}
