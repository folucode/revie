const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const db = require('../src/config/db');

let userToken;
let userId;

beforeEach(async () => {
  const userObj = await request(app).post('/register').send({
    name: 'Tosin',
    email: 'temi@app.net',
    password: 'MyPass777!',
  });

  userId = userObj.body.data.user.id;
  userToken = userObj.body.data.token;

  await db.query(
    'INSERT INTO apartments (type, address, state, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
    ['2 bedroom', 'ajanlekoko abejoye', 'Lagos', userId],
  );
});

afterEach(async () => {
  await db.query('TRUNCATE TABLE apartments');

  await db.query('TRUNCATE TABLE users');
});

describe('Apartment Routes', () => {
  it('should add a new apartment', async () => {
    await request(app)
      .post('/apartments/new')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        type: '2 bedroom',
        address: 'ajanlekoko abejoye',
        state: 'Lagos',
      })
      .expect(201);
  });

  it('should get all existing apartments', async () => {
    await request(app)
      .get('/apartments')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });
});
