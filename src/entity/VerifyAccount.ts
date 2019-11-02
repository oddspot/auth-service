import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class VerifyAccount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  isVerified: boolean = false;

  @Column({ type: 'varchar', nullable: true })
  token: string | null = null;

  @Column({ type: 'datetime', nullable: true })
  tokenExpiration: Date | null = null;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;
}
