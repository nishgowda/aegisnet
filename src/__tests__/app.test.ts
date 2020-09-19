import express from 'express';
import { Aegis } from '../index';
import redis from 'redis'
const connectionString = 'redis://127.0.0.1:6379';
const app = express()
const aegis = new Aegis('redis', connectionString)
const client = redis.createClient(connectionString)

app.use((req, res, next) => {
    aegis.listen(req, res, next);
})

app.get('/api/', (_, res) => {
    res.status(200).send('Hello')
})
let port = 5000;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})

test('Aegis Check', () => {

    client.get('stats', (err, result) => {
        if (err) throw err;
        expect(result).toBe({ 'GET /api/ 200': 1 })
    });

})