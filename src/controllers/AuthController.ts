import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { User } from '../entity';
import { config } from '../config';
import { VerifyAccount } from '../entity/VerifyAccount';

export class AuthController {
  static login = async (request: Request, response: Response) => {
    const { email, username, password } = request.body;
    if (!password || !(!username || !email)) {
      return response.status(422).json({ error: 'Please provide all required parameters.' });
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      const where = !!email ? { email } : { username };
      user = await userRepository.findOneOrFail({ where });
    } catch (error) {
      return response.status(401).json({ error: 'Invalid credentials.' });
    }

    const verifyAccount = await user.verifyAccount;
    if (!verifyAccount.isVerified) {
      return response.status(401).json({ error: 'Account is not verified.' });
    }

    if (!user.checkIfPasswordIsValid(password)) {
      return response.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '1h'}
    );

    const userFormated = {
      id: user.id,
      username: user.username,
      email: user.email
    };
    return response.status(200).json({ user: userFormated, token });
  }

  static changePassword = async (request: Request, response: Response) => {
    const { id } = response.locals.jwtPayload;
    const { password, newPassword } = request.body;

    if (!password || !newPassword) {
      response.status(422).json({ error: 'Please provide all required parameters.' });
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (e) {
      return response.status(401).json({ error: 'Invalid credentials.' });
    }

    if (!user.checkIfPasswordIsValid(password)) {
      return response.status(401).json({ error: 'Invalid credentials.' });
    }

    user.password = newPassword;
    const validationErrors = await validate(user);
    if (validationErrors.length > 0) {
      return response.status(400).json({ errors: validationErrors });
    }

    user.hashPassword();

    try {
      user = await userRepository.save(user);
      delete user.password;
    } catch (error) {
      return response.status(409).json({ errors: error.message });
    }

    response.status(200).json({ message: 'Password successfully updated.'});
  }

  static verifyAccount = async (request: Request, response: Response) => {
    const { email, token } = request.query;
    if (!email || !token) {
      return response.status(422).json({ error: 'Please provide all required parameters.' });
    }

    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.findOneOrFail({ where: { email } });
    } catch (e) {
      return response.status(422).json({ error: 'We couldn\'t find your account.' });
    }

    const verifyAccount = await user.verifyAccount;
    if (verifyAccount.tokenExpiration && new Date() > verifyAccount.tokenExpiration) {
      return response.status(409).json({ error: 'Token is expired. Please request new one.' });
    }

    if (verifyAccount.token !== token) {
      return response.status(401).json({ error: 'Token is not valid.' });
    }

    verifyAccount.isVerified = true;

    const verifyAccountRepository = getRepository(VerifyAccount);
    try {
      await verifyAccountRepository.save(verifyAccount);
    } catch (e) {
      return response.status(409).json({ errors: e.message });
    }

    return response.status(200).json({ message: 'Successfully confirmed account.' });
  }
}
