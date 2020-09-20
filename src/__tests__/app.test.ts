import app from '../app'; // Link to server file
import supertest from 'supertest';
const request = supertest(app);

// Check numbers before call
// const apiCounter = 0;
test('Aegis endpoint tests', async (done) => {
  const result = await request.get('/stats/');
  console.log(JSON.parse(result.text))
  expect(JSON.parse(result.text)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({method: "GET", route: "/stats/", statusCode: 200}),
    ])
  );
  done();
})
    /*  
      Sends GET Request to /api endpoint 
      and check with stats endpoint
    */
    