import app from '../app'; // Link to server file
import supertest from 'supertest';
const request = supertest(app);

 // Check redis before running. Update on change
test('Aegis endpoint tests', async () => {
  const result = await request.get('/stats/');

  expect(JSON.parse(result.text)).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ method: "GET", route: "/stats/", statusCode: 200 }),
    ])
  );
});
