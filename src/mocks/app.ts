import express from 'express';
import { AegisNet } from '../index';
import redis from 'redis';
const app = express();
app.use(express.json());

const connectionString = 'redis://127.0.0.1:6379';
const aegis = new AegisNet(connectionString);
const client = redis.createClient(connectionString);
app.use((req, res, next) => {
  aegis.listen(req, res, next);
});

app.get('/api/users', (_, res) => {
  // note: Redis will store the data as a JSON string
  //  so it's important you parse to work with it.
  client.get('response-times', (err, stats) => {
    if (err) throw err;
    res.status(200).send(stats);
  });
});

app.listen(5000, () => 'Listening');
