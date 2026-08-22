import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startServer } from "./helpers.js";

let server;

before(async () => {
  server = await startServer();
});

after(async () => {
  await server.close();
});

test("GET /items defaults to page 1 with a limit of 20", async () => {
  const res = await fetch(`${server.baseUrl}/items`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.count, 8);
  assert.equal(body.total, 8);
  assert.equal(body.page, 1);
  assert.equal(body.hasMore, false);
  assert.equal(body.items.length, 8);
  assert.equal(body.items[0].name, "RTX 5090");
});

test("GET /items returns the requested page and limit", async () => {
  const res = await fetch(`${server.baseUrl}/items?page=2&limit=3`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.count, 3);
  assert.equal(body.total, 8);
  assert.equal(body.page, 2);
  assert.equal(body.hasMore, true);
  assert.deepEqual(body.items.map((item) => item.id), [4, 5, 6]);
});

test("GET /items reports hasMore false on the final page", async () => {
  const res = await fetch(`${server.baseUrl}/items?page=3&limit=3`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.count, 2);
  assert.equal(body.page, 3);
  assert.equal(body.hasMore, false);
  assert.deepEqual(body.items.map((item) => item.id), [7, 8]);
});

test("GET /items reports hasMore true on the page before the last", async () => {
  const first = await (await fetch(`${server.baseUrl}/items?page=1&limit=4`)).json();
  assert.equal(first.hasMore, true);

  const second = await (await fetch(`${server.baseUrl}/items?page=2&limit=4`)).json();
  assert.equal(second.count, 4);
  assert.equal(second.hasMore, false);
});

test("GET /items returns an empty page beyond the last page", async () => {
  const res = await fetch(`${server.baseUrl}/items?page=5&limit=3`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.count, 0);
  assert.deepEqual(body.items, []);
  assert.equal(body.total, 8);
  assert.equal(body.page, 5);
  assert.equal(body.hasMore, false);
});

test("GET /items rejects limit=0", async () => {
  const res = await fetch(`${server.baseUrl}/items?limit=0`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.errors[0], /positive integer/);
});

test("GET /items rejects limit=101", async () => {
  const res = await fetch(`${server.baseUrl}/items?limit=101`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.errors[0], /100 or fewer/);

  const boundary = await fetch(`${server.baseUrl}/items?limit=100`);
  assert.equal(boundary.status, 200);
});

test("GET /items rejects non-numeric page and limit", async () => {
  const res = await fetch(`${server.baseUrl}/items?page=abc&limit=x`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.errors.length, 2);
});

test("GET /items preserves the item response shape", async () => {
  const res = await fetch(`${server.baseUrl}/items?page=1&limit=1`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(Object.keys(body.items[0]), ["id", "name", "category", "location", "addedAt"]);
});
