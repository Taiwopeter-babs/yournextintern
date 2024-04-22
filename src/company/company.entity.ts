import BaseEntity from 'src/lib/entities/baseEntity';
import { InternCompany } from 'src/lib/entities/internCompany.entity';
import { Entity, Column, OneToMany } from 'typeorm';
import CompanyDto from './dto/company.dto';

@Entity('companies')
export default class Company extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public name: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  public address: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: true,
  })
  public website: string;

  /**
   * The type of service the company provides
   */
  @Column({
    type: 'varchar',
    length: 128,
    nullable: false,
  })
  public serviceType: string;

  /**
   * available positions in the company. Defaults to 0.
   */
  @Column({
    type: 'integer',
    default: 0,
  })
  public availablePositions: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  public applicationOpen: boolean;

  @OneToMany(() => InternCompany, (internCompany) => internCompany.company)
  public internCompanies: InternCompany[];

  ToDto: (entity: Company) => CompanyDto;
}
