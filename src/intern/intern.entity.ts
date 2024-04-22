import BaseEntity from 'src/lib/entities/baseEntity';
import { InternCompany } from 'src/lib/entities/internCompany.entity';
import { Entity, Column, OneToMany } from 'typeorm';

enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('interns')
export default class Intern extends BaseEntity {
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public firstName: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  public lastName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  public gender: Gender;

  @Column({
    type: 'date',
    nullable: false,
  })
  public birthday: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public school: string;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
    nullable: false,
  })
  public phone: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  public course: string;

  @Column({
    type: 'integer',
    default: 0,
  })
  public numberOfApplications: number;

  @OneToMany(() => InternCompany, (internCompany) => internCompany.intern)
  public internCompanies: InternCompany[];
}
