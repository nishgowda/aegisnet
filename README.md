![Logo](misc/AegisNet-logo.png)


Fast and light weight api and endpoint monitoring backed by Redis and carefully written for performace.

![build](https://github.com/nishgowda/AegisNet/workflows/build/badge.svg)
![npm](https://img.shields.io/npm/v/aegis-net)
![GitHub](https://img.shields.io/github/license/nishgowda/aegis)

## Features:
- [X] Url request monitoring
- [X] Easily integratable with Express, Koa, and standard http
- [X] Fast and efficient data storage based on Redis
- [X] Monitoring daily requests
- [X] Moinotring requests per hour
- [X] Monitoring response times
- [X] Custom option

### A quick rundown:
* An object is made in redis that is defined as an **event**. An **event** is a collection of the route, the method, the status code, the number of requests, and date and hour (depending on what key is specified).

* Redis stores the data per request into three separate keys:
    1. The total number of requests per event (date and hour are not included here)
    2. The total number of requests per event per day
    3. The total number of requests per event per hour of every day.
    4. The time in milliseconds each event takes per request. 
* Note: These keys are stored by default as key names: 'total', 'daily', 'hourly', and 'response-times'.


## Install
``` 
    $ npm install aegis-net
```

## Usage:
### With Express:
``` javascript
const express = require('express')
const AegisNet = require('aegis-net');
const app = express();
app.use(express.json());
const aegis = new AegisNet;

app.use(aegis.express())
```
### With Koa:
```javascript
const koa = require('koa');
const AegisNet = require('aegis-net');
const router = require('@koa/router');
const app = new koa();
const router = new Router();

app.use(aegis.koa());

```
### With http:
```javascript
const http = require('http');
const AegisNet = require('aegis-net');

const server = http.createServer((req, res) => {
    // server code her
    aegis.http(req, res);
});
server.listen(3000, () => "Listening");

```

### If you want to add custom options:

``` javascript
const express = require('express')
const AegisNet = require('aegis-net');
const app = express();
app.use(express.json());
const aegis = new AegisNet;

app.use(aegis.express({port: 6379, host: 'localhost', dailyKey: "foo"}))

```



### Retrieving the data:
```javascript
app.get('/api/users',  (_, res) => {
      // note: Redis will store the data as a JSON string 
     //  so it's important you parse after you retrieve it to work with it.
    client.get('total', (err, stats) => {
        res.status(200).send(stats);
    });
});
```

## API:
|options|about|type|
|---------|-------|------|
| port | Redis port number| number
|host|Redis host|string
|totalKey| Key name for total requests, defaults to "total"| string|
|dailyKey| Key name for daily requests, defaults to "daily"| string
|hourlyKey| Key name for hourly requests, defaults to "hourly"| string|
|responseKey| Key name for response-time key, defaults to "response-times"| string|


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
- It is very important you initialize the middleware before any of your routes or custom middleware. If you don't do this, you may find some unkown error. Further testing with it is required.
 - Any unkown request sent to the server will send the event with route of "unkown route".




