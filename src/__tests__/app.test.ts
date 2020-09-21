import app from '../app'; // Link to server file
import supertest from 'supertest';
const request = supertest(app);

 // Check redis before running. Update on change
test('Aegis endpoint tests', async () => {
  const result = await request.get('/stats/');
  let json = JSON.parse(result.text)
  expect(json).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ method: "GET", route: "/stats/", statusCode: 200 }),
    ])
  );
});
