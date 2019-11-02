import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import app from '../../../server';
import { User, VerifyAccount } from '../../../entity';

beforeEach(async () => {
  return createConnection({
    type: 'sqlite',
    database: 'db.sqlite',
    dropSchema: true,
    entities: [User, VerifyAccount],
    synchronize: true,
    logging: false
  });
});

afterEach(async () => {
  const connection = getConnection();
  return connection.close();
});

describe('POST /users', () => {
  it('should create user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'test123',
        email: 'test@test.com',
        password: '123456'
      });

    const expectedBody = {
      id: 1,
      username: 'test123',
      email: 'test@test.com'
    };

    expect(response.status).toEqual(201);
    expect(response.body).toEqual(expectedBody);
  });

  it('should fail - wrong username', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        username: 'test',
        email: 'test@test.com',
        password: '123456'
      });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('errors');
  });
});
