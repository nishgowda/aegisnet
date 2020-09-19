import express from 'express';
import { Aegis } from '../index';
import redis from 'async-redis';

const connectionString = 'redis://127.0.0.1:6379';
const app = express()
const aegis = new Aegis('redis', connectionString)
const client = redis.createClient(connectionString);


app.use((req, res, next) => {
    aegis.listen(req, res, next);
})

app.get('/api/', (_, res) => {
    res.status(200).send('Hello')
})

app.get('/stats/', async (_, res) => {
    const stats = await client.get('stats')
    res.status(200).send(stats)
})



const port = 5000
if (process.env.NODE_ENV !== 'test') {
    app.listen(port);
  }

export default app;