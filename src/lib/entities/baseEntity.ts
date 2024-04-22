import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

export default abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 60,
    unique: true,
    nullable: false,
  })
  public email: string;

  @Column({
    type: 'varchar',
    length: 128,
    unique: true,
    nullable: false,
  })
  public password: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: true,
  })
  public profileImageUrl: string;
}
