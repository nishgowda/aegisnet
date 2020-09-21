![Logo](misc/AegisNet-logo.png)
Fast and light weight api and endpoint monitoring backed by Redis and carefully written for scalabilty and performace.

## Features:
- [X] Url request monitoring
- [X] Easily intergratable with express
- [X] Fast and efficient data storage based on Redis
- [X] Daily monitoring
- [X] Hourly monitoring

### A quick rundown:
* An object is made in redis that is defined as an **event**. An **event** is a collection of the route, the method, the status code, the number of requests, and date and hour (depending on what key is specified).

* Redis stores the data per request into three sepreate keys:
 - "total" - the total number of requests per event (date and hour are not included here)
 - "daily" - the total number of requests per event per day
 - "hourly" - the total number of requests per event per hour of every day.

## Install
``` 
    npm install aegis-net
```

## Usage:
``` javascript
const express = require('express')
const { AegisNet } = require('aegis-net');
const app = express();
app.use(express.json());
// must include your redis connection String
const connectionString = 'redis://127.0.0.1:6379';
const aegis = new AegisNet(connectionString);

app.use((req, res, next) => {
  aegis.listen(req, res, next);
});
```

### Retrieving the data:
```javascript
app.get('/api/users',  (_, res) => {
      // note: Redis will store the data as a JSON string 
     //  so it's important you parse to work with it.
    client.get('total', (err, stats) => {
        res.status(200).send(JSON.parse(stats));
    });
});

```

#### Example data:

``` JSON
[ { "method": "GET", "route": "/api/users", "statusCode": 200, "requests": 10 }]

```
``` JSON
[ { "method": "POST", "route": "/api/users", "statusCode": 200, "requests": 5, "date": "9/20/2020" }]

```
``` JSON
[ { "method": "PUT", "route": "/api/users", "statusCode": 200, "requests": 2, "date": "9/20/2020", "hour": "12" }]

```




