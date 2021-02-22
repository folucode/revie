const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const db = require('../src/config/db');

describe('Apartment Routes', () => {
  it('should add a new apartment', async () => {
    await request(app)
      .post('/apartments/new')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUxLCJpYXQiOjE2MTQwMDI3NTIsImV4cCI6MTYxNDA4OTE1Mn0.kqQD5wp4b8JmMA0cx55nsM2pjDhK4DofdPBM-Aod_v0',
      )
      .send({
        type: '2 bedroom',
        address: 'ajanlekoko abejoye',
        state: 'Lagos',
      })
      .expect(201);
  });
});
