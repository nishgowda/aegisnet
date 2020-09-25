import express from "express";
import { AegisNet }  from "..";
import Redis from "ioredis";
const app = express();
const client = new Redis()
const aegis = new AegisNet();
app.use(aegis.express({ host: "localhost", port: 6379 }));

app.get("/api/blah", (_, res) => {
  client.get("total", (err, result) => {
    if (err) throw err;
    res.status(200).send(result);
  });
});

app.listen(5000, () => "Listening");
export default app;
