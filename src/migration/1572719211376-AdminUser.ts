import { getRepository, MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../entity';
import { VerifyAccount } from '../entity/VerifyAccount';

export class AdminUser1572719211376 implements MigrationInterface {
  public async up(): Promise<void> {
    const admin = new User();
    admin.username = 'admin1';
    admin.password = 'admin1';
    admin.hashPassword();
    admin.email = 'admin1@oddspot.io';

    const verifyAccount = new VerifyAccount();
    verifyAccount.isVerified = true;
    admin.verifyAccount = Promise.resolve(verifyAccount);

    await getRepository(User).save(admin);
  }

  public async down(): Promise<any> {
    throw new Error('Not implemented.');
  }
}
