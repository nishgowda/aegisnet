![Logo](misc/AegisNet-logo.png)


Fast and light weight api and endpoint monitoring backed by Redis and carefully written for performace.


![build](https://github.com/nishgowda/AegisNet/workflows/build/badge.svg)

## Features:
- [X] Url request monitoring
- [X] Easily intergratable with express
- [X] Fast and efficient data storage based on Redis
- [X] Daily monitoring
- [X] Hourly monitoring

### A quick rundown:
* An object is made in redis that is defined as an **event**. An **event** is a collection of the route, the method, the status code, the number of requests, and date and hour (depending on what key is specified).

* Redis stores the data per request into three sepreate keys:
 1. "total" - the total number of requests per event (date and hour are not included here)
 2. "daily" - the total number of requests per event per day
 3. "hourly" - the total number of requests per event per hour of every day.
 4. "response-times" - the time in milliseconds each event takes per request. 
 

## Install
``` 
    $ npm install aegis-net
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
     //  so it's important you parse after you retrueve itto work with it.
    client.get('total', (err, stats) => {
        res.status(200).send(stats);
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
[ { "method": "GET", "route": "/api/users", "statusCode": 304, "requests": 2, "date": "9/20/2020", "hour": "12" }]

```
#### Side Notes:
- It is very important you initialize the listen middleware before any of your routes or custom middleware. If you don't do this, you may find some unkown error. Further testing with it is required.
 - Any unkown request sent to the server will send the event with route of "unkown route".




