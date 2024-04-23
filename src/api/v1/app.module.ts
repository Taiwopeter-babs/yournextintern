import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyModule } from './company/company.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'configuration/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternModule } from '../../intern/intern.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    CompanyModule,
    ConfigModule.forRoot({
      load: [configuration],
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // database url
        url:
          configService.get('NODE_ENV') === 'development'
            ? configService.get<string>('POSTGRES.POSTGRES_DEV')
            : configService.get<string>('POSTGRES.POSTGRES_PROD'),

        // configured for development environments only
        synchronize:
          configService.get('NODE_ENV') === 'development' ? true : false,

        // entities configured with TypeOrmModule.forFeature() are loaded
        autoLoadEntities: true,

        migrations: ['migrations/*.ts'],
        migrationsTableName: 'yni_migrations',
      }),
    }),
    InternModule,
    RepositoryModule,
    //
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
