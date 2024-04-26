import BaseEntity from '../lib/entities/baseEntity';
import { InternCompany } from '../interncompany/internCompany.entity';
import { Entity, Column, OneToMany, Index } from 'typeorm';

@Entity('companies')
export default class Company extends BaseEntity {
  @Index()
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public address: string;

  @Column({
    type: 'varchar',
    length: 100,
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
  public numberPositions: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  public applicationOpen: boolean;

  @OneToMany(() => InternCompany, (internCompany) => internCompany.company)
  public companyInterns: InternCompany[];
}
