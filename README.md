![Logo](misc/AegisNet-logo.png)
Fast and light weight api and endpoint monitoring backed by Redis and carefully written for scalabilty and performace.

## Features:
- [X] Url request monitoring
- [X] Easily intergratable with express
- [X] Fast and efficient data storage based on Redis
- [X] Daily monitoring
- [ ] Hourly monitoring

### A quick rundown:
* AegisNet defines it's data as a made "event". An event is made up of the method, the route, the status code, and possibily the date (depending on which key is being assigned) that is requested. When a certain event is hit, the number of requests are incremented.

* Redis stores the data per request into two sepreate keys. As seen below, one of these is "total". As the name implies it stores the total number of requests for each event. If you want to retrieve the daily total, you can just specify the "daily" key instead. 

## Install
``` 
    npm install aegis-net
```

## Usage:
``` javascript
const express = require('express')
const AegisNet = require('aegis-net');
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




