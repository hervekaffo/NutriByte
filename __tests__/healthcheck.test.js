import request from 'supertest';
import app from '../backend/server.js';
import mongoose from 'mongoose';

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Health Check API', () => {
  it('should respond 200 with { status: "ok" }', async () => {
    const res = await request(app).get('/api/healthcheck');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
