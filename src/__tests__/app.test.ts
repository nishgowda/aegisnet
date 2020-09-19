import app from './app'; // Link to server file
import supertest from 'supertest';
const request = supertest(app);

// check numbers before call
const apiCounter = 4;
const statCounter = 4;
describe('Aegis', () => {
  it('Endpoint test', async () => {
    /* Sends GET Request to /api endpoint 
           and check with stats endpoint
        */
    await request.get('/api/');
    const result = await request.get('/stats/');
    expect(JSON.parse(result.text)).toBe(
      `{'{"date":"2020/9/19","method":"GET","route":"/api/","statusCode":200}': ${apiCounter},'{"date":"2020/9/19","method":"GET","route":"/stats/","statusCode":200}': ${statCounter}}`,
    );
  });
});
