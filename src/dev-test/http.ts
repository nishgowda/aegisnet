// Note these files are meant to test aegisnet for http in development
import http from "http";
import { AegisNet } from "../index";
const aegis = new AegisNet();

const server = http.createServer((req, res) => {
  if (req.method !== "GET") {
    res.end(`{"error": "${http.STATUS_CODES[405]}"}`);
  } else {
    if (req.url === "/api/http") {
      res.end(`<h1>Hello</h1>`);
    }
  }
  aegis.http(req, res);
});

server.listen(3000, () => "Listening");
