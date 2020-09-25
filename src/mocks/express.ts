import express from 'express' 
import AegisNet from '../index1'
import redis from 'redis'
const app = express();
const connectionString = 'redis://127.0.0.1:6379'

const client = redis.createClient(connectionString)
const aegis = new AegisNet()
app.use(aegis.express({server: 'express', host: 'localhost', port: 6379, dailyKey: 'new-daily'}))

app.get('/api/blah', (_, res) => {
    client.get('total', (err, result) => {
        if (err) throw err;
        res.status(200).send(result);
    })
})

app.listen(5000, () => 'Listening')
