const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const db = require('../src/config/db');

afterEach(async () => {
  await db.query('TRUNCATE TABLE users');

  const encodedPassword = bcrypt.hashSync('password', 8);

  await db.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    ['Temi', 'temi@app.net', encodedPassword],
  );
});

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

  it('should not register user', async () => {
    await request(app)
      .post('/register')
      .send({
        name: 'Tosin',
        email: 'temi@app.net',
        password: 'MyPass777!',
      })
      .expect(403);
  });

  it('should give a validation error', async () => {
    await request(app)
      .post('/register')
      .send({
        name: 'Jale',
        email: 'jale@example.zen',
        password: 'MyPass777!',
      })
      .expect(422);
  });

  it('should login existing user', async () => {
    await request(app)
      .post('/login')
      .send({
        email: 'temi@app.net',
        password: 'password',
      })
      .expect(200);
  });

  it('should not login non-existent user', async () => {
    await request(app)
      .post('/login')
      .send({
        email: 'kebbi@app.net',
        password: 'thisisnotmypass',
      })
      .expect(401);
  });
});
