import redis from 'async-redis';
const connectionString = 'redis://127.0.0.1:6379';
const client = redis.createClient(connectionString);


 // Check redis before running. Update on change
test('Aegis endpoint tests', async () => {
  const stats = await client.get('total');
  console.log(stats);
  expect(stats).toEqual("[{\"method\":\"GET\",\"route\":\"/stats/\",\"statusCode\":200,\"requests\":6}]");
});
