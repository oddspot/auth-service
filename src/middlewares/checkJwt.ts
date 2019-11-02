import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config';

export const checkJwt = (request: Request, response: Response, next: NextFunction) => {
  const authorizationHeaderKey = 'authorization';
  const token = request.headers[authorizationHeaderKey] as string;

  let jwtPayload;
  try {
    jwtPayload = jwt.verify(token, config.jwtSecret);
    response.locals.jwtPayload = jwtPayload;
  } catch (error) {
    return response.status(401).json({ error: 'JWT Token not valid.' });
  }

  // refresh token
  const { id, username } = jwtPayload;
  const newToken = jwt.sign(
    { id, username },
    config.jwtSecret,
    { expiresIn: '1h' }
  );
  response.setHeader(authorizationHeaderKey, newToken);

  next();
};
