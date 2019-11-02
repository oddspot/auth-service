import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';
import { IsNotEmpty, Length } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { VerifyAccount } from './VerifyAccount';

@Entity()
@Unique(['email', 'username'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty()
  email!: string;

  @Column()
  @Length(6, 20)
  username!: string;

  @Column()
  @Length(6, 100)
  password!: string;

  @OneToOne(type => VerifyAccount, { cascade: true })
  @JoinColumn()
  verifyAccount!: Promise<VerifyAccount>;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

  public hashPassword = () => {
    this.password = bcrypt.hashSync(this.password);
  }

  public checkIfPasswordIsValid = (unencryptedPassword: string): boolean => {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
