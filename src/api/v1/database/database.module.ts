import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

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

        migrations: ['./v1_migrations/*.ts'],
        migrationsTableName: 'yni_migrations',
      }),
    }),
  ],
})
export class DatabaseModule {}
