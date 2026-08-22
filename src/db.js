// In-memory data store for the homelab inventory API.
// Deliberately simple: no persistence, seeded at import time.

import { isWithinRange } from "./lib/dates.js";

let nextId = 9;

const items = [
  { id: 1, name: "RTX 5090", category: "gpu", location: "WINdoze", addedAt: "2026-07-02T09:15:00Z" },
  { id: 2, name: "Ryzen AI Max mini-PC", category: "compute", location: "rack", addedAt: "2026-07-14T18:40:00Z" },
  { id: 3, name: "DS1621xs+", category: "storage", location: "rack", addedAt: "2026-07-21T11:05:00Z" },
  { id: 4, name: "Fire HD 10 wall panel", category: "display", location: "hallway", addedAt: "2026-07-28T20:12:00Z" },
  { id: 5, name: "DGX Spark", category: "compute", location: "bench", addedAt: "2026-08-03T08:30:00Z" },
  { id: 6, name: "UPS 1500VA", category: "power", location: "rack", addedAt: "2026-08-07T13:55:00Z" },
  { id: 7, name: "Kindle Paperwhite 2", category: "display", location: "drawer", addedAt: "2026-08-10T14:32:00Z" },
  { id: 8, name: "Zigbee coordinator", category: "iot", location: "hallway", addedAt: "2026-08-10T21:47:00Z" }
];

export function all() {
  return items;
}

export function byId(id) {
  return items.find((item) => item.id === id) ?? null;
}

export function insert(fields) {
  const item = {
    id: nextId++,
    name: fields.name,
    category: fields.category,
    location: fields.location,
    addedAt: fields.addedAt ?? new Date().toISOString()
  };
  items.push(item);
  return item;
}

export function findInRange(fromDate, toDate) {
  return items.filter((item) => isWithinRange(item.addedAt, fromDate, toDate));
}

export function paginate(offset, limit) {
  return { items: items.slice(offset, offset + limit), total: items.length };
}
