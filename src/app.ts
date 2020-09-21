import express from 'express';
import { Aegis } from './index';
import redis from 'async-redis';

const connectionString = 'redis://127.0.0.1:6379';
const app = express();
app.use(express.json());
const aegis = new Aegis(connectionString);
const client = redis.createClient(connectionString);

app.use((req, res, next) => {
  aegis.listen(req, res, next);
});

app.get('/api/', async (_, res) => {
  try {
    res.status(200).send('Hello');
  } catch (error) {
    throw error;
  }
});

app.get('/stats/', async (_, res) => {
  try {
    const stats = await client.get('total');
    res.status(200).send(stats);
  } catch (error) {
    throw error;
  }
});

const port = 5000;
app.listen(port);


export default app;
