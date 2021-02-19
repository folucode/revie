const request = require('supertest');
const app = require('../src/app');

describe('User Routes', () => {
  it('should register new user', async () => {
    await request(app)
      .post('/register')
      .send({
        name: 'Tosin',
        email: 'tosin@example.com',
        password: 'MyPass777!',
      })
      .expect(201);
  });
});
