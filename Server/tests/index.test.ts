import request from 'supertest';

import app from '../src/index';

test('async get hello', async () => {
  const response = await request(app.callback()).get('/api/hello');
  expect(response.status).toBe(200);
  expect(response.text).toBe('Hello World from the Hello Controller!!');
});

test('async post hello', async () => {
  const response = await request(app.callback()).post('/api/hello');
  expect(response.status).toBe(204);
});
