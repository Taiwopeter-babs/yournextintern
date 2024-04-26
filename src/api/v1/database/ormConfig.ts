// This file serves only as the path for typeorm migrations generation as it is the duplicate
// of the configuration found in database.module.ts file in this same folder path.
// TypeOrm requires an exported Datasource file. This is it

import { DataSource } from 'typeorm';
import configuration from '../configuration/configuration';
import Company from '../company/company.entity';
import Intern from '../intern/intern.entity';
import { InternCompany } from '../interncompany/internCompany.entity';

/**
 * This is for typeorm migrations generation.
 */
const dataSource: DataSource = new DataSource({
  // TypeORM PostgreSQL DB Drivers configuration
  ...configuration().POSTGRES,
  entities: [Company, Intern, InternCompany],
  // Synchronize database schema with entities
  synchronize: configuration().NODE_ENV === 'development',
  migrations: ['./migrations/*.ts'],
  migrationsTableName: 'yni_migrations',
});

console.log(configuration().NODE_ENV);
console.log(configuration().POSTGRES);

export default dataSource;
