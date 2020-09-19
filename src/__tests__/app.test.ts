import app from './app'; // Link to your server file
import supertest from 'supertest';
const request = supertest(app);

 // check numbers before call
let apiCounter = 8
let statCounter = 1

describe('Aegis', () => {
    it('Endpoint test', async () => {
        // Sends GET Request to /api endpoint
        await request.get('/api/');
        const result = await request.get('/stats/');
        expect(result.text).toBe(`{\"2020/9/19: GET /api/ 200\":1,\"2020/9/19:GET /api/ 200\":${apiCounter += 1} ,\"2020/9/19:GET /stats/ 200\":${statCounter += 1}}}`);
      });
})

