import Redis from "ioredis";
import app from "../dev-test/express";
import supertest from "supertest";
const request = supertest(app);
/* 
  @todo: work on better teting 
*/
const client = new Redis();
test("testing redis set", async () => {
  client.set(
    "total",
    JSON.stringify([
      { method: "GET", route: "/api/blah", statusCode: 200, requests: 1 },
    ])
  );
});

test("mock api call", async () => {
  const result = await request.get("/api/blah");
  expect(result.status).toBe(200);
});

test("mocking redis", async () => {
  const result = await client.get("total");
  console.log(result);
  expect(JSON.parse(result || "{}")).toStrictEqual([
    { method: "GET", route: "/api/blah", statusCode: 200, requests: 1 },
  ]);
});
