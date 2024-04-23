import {
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
  Index,
  BeforeInsert,
} from 'typeorm';

export default abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Index()
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

  /**
   * Before insert event listeners.
   */
  @BeforeInsert()
  toLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
