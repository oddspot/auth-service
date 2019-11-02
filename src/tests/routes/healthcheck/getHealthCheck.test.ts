import * as request from 'supertest';
import app from '../../../server';

describe('GET /healthcheck', () => {
  it('should get healthcheck', async () => {
    const response = await request(app)
      .get('/healthcheck');

    expect(response.ok).toEqual(true);
    expect(response.body).toHaveProperty('status');
    expect(response.body).toHaveProperty('time');
  });
});
