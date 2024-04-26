import Company from '../company/company.entity';
import Intern from '../intern/intern.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('internscompanies')
export class InternCompany {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ primary: true })
  public internId: number;

  @Column({ primary: true })
  public companyId: number;

  @CreateDateColumn()
  public dateApplied: Date;

  @ManyToOne(() => Company, (company) => company.companyInterns, {
    cascade: ['remove', 'update'],
  })
  public company: Company;

  @ManyToOne(() => Intern, (intern) => intern.internCompanies, {
    cascade: ['remove', 'update'],
  })
  public intern: Intern;
}
