import app from '../app'; // Link to server file
import supertest from 'supertest';
const request = supertest(app);

const requstCount = 54; // Check redis before running. Update on change
test('Aegis endpoint tests', async (done) => {
  const result = await request.get('/stats/');
  expect(JSON.parse(result.text)).toEqual(
    [ { method: 'GET', route: '/stats/', statusCode: 200, requests: requstCount } ]
  );
  done();
});
