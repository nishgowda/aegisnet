import express from 'express';
import { Aegis } from '../index';
const connectionString = 'redis://127.0.0.1:6379';
const app = express();
const aegis = new Aegis('redis', connectionString);

app.use((req, res, next) => {
  aegis.listen(req, res, next);
});

app.get('/api/', (_, res) => {
  res.status(200).send('Hello');
});
export default app;
