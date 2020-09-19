import redis from 'redis';
import app from './app'; // Link to your server file
import supertest from 'supertest';
const request = supertest(app);

const connectionString = 'redis://127.0.0.1:6379';
const client = redis.createClient(connectionString);
let count = 0; // check number before call

it('Endpoint test', async (done) => {
  // Sends GET Request to /test endpoint
  await request.get('/api');
  client.get('stats', (err, result) => {
    if (err) throw err;
    expect(result).toBe(`{\"event\":\"GET /api/ 200\",\"GET /api/ 200\":${(count += 1)}}`);
  });
  done();
});
