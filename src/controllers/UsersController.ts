import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { User } from '../entity';
import { VerifyAccount } from '../entity/VerifyAccount';

export class UsersController {
  static register = async (request: Request, response: Response) => {
    const { username, email, password } = request.body;
    const newUser = new User();
    newUser.email = email;
    newUser.username = username;
    newUser.password = password;

    const verifyAccount = new VerifyAccount();
    verifyAccount.token = randomBytes(64).toString('hex');
    verifyAccount.tokenExpiration = new Date(new Date().getTime() + 15 * 60 * 1000);
    newUser.verifyAccount = Promise.resolve(verifyAccount);

    const validationErrors = await validate(newUser);
    if (validationErrors.length > 0) {
      return response.status(400).json({ errors: validationErrors });
    }

    newUser.hashPassword();

    const userRepository = getRepository(User);
    let user: User;

    try {
      user = await userRepository.save(newUser);
    } catch (error) {
      return response.status(409).json({ errors: error.message });
    }

    // Remove information we don't want to send
    response.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  }
}
