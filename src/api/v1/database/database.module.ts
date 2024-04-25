import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import Intern from '../intern/intern.entity';
import Company from '../company/company.entity';
import { InternCompany } from '../interncompany/internCompany.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<DataSourceOptions>('POSTGRES'),

        // configured for development environments only
        synchronize: configService.get<string>('NODE_ENV') === 'development',

        // entities configured with TypeOrmModule.forFeature() are loaded
        autoLoadEntities: true,
        // In case you are wondering, NestJs autoLoadEntities didn't work. entities had to be specified
        entities: [Intern, Company, InternCompany],
        migrations: ['./migrations/*.ts'],
        migrationsTableName: 'yni_migrations',
      }),
    }),
  ],
})
export class DatabaseModule {}
