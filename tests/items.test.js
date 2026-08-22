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

test("GET /health reports ok", async () => {
  const res = await fetch(`${server.baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, "ok");
});

test("GET /items lists all seed items", async () => {
  const res = await fetch(`${server.baseUrl}/items`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.count, 8);
  assert.equal(body.items.length, 8);
  assert.equal(body.items[0].name, "RTX 5090");
});

test("GET /items/:id returns a single item", async () => {
  const res = await fetch(`${server.baseUrl}/items/3`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.name, "DS1621xs+");
  assert.equal(body.category, "storage");
});

test("GET /items/:id returns 404 for an unknown id", async () => {
  const res = await fetch(`${server.baseUrl}/items/999`);
  assert.equal(res.status, 404);
});

test("POST /items rejects an invalid payload with field errors", async () => {
  const res = await fetch(`${server.baseUrl}/items`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "", category: "snacks" })
  });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.equal(body.errors.length, 3);
});

test("POST /items creates a valid item", async () => {
  const res = await fetch(`${server.baseUrl}/items`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "PoE switch", category: "network", location: "rack" })
  });
  assert.equal(res.status, 201);
  const body = await res.json();
  assert.equal(body.name, "PoE switch");
  assert.ok(body.id > 8);
});

test("GET /items/search rejects an invalid range", async () => {
  const res = await fetch(`${server.baseUrl}/items/search?from=2026-08-10&to=2026-08-01`);
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.match(body.errors[0], /on or before/);
});

test("GET /items/search includes items added on the from date", async () => {
  const res = await fetch(`${server.baseUrl}/items/search?from=2026-08-03&to=2026-08-08`);
  assert.equal(res.status, 200);
  const body = await res.json();
  const names = body.items.map((item) => item.name);
  assert.ok(names.includes("DGX Spark"), "item added on the from date should be returned");
});

test("GET /items/search includes items added on the to date", async () => {
  // The range is documented as inclusive on both ends. Items 7 and 8 were
  // both added on 2026-08-10 and must appear when to=2026-08-10.
  const res = await fetch(`${server.baseUrl}/items/search?from=2026-08-01&to=2026-08-10`);
  assert.equal(res.status, 200);
  const body = await res.json();
  const names = body.items.map((item) => item.name);
  assert.ok(names.includes("Kindle Paperwhite 2"), "item added on the to date should be returned");
  assert.ok(names.includes("Zigbee coordinator"), "item added late on the to date should be returned");
  assert.equal(body.count, 4);
});
