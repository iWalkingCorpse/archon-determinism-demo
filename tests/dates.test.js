import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDate, isWithinRange } from "../src/lib/dates.js";

test("parseDate parses a valid YYYY-MM-DD date at midnight UTC", () => {
  const date = parseDate("2026-08-10");
  assert.ok(date instanceof Date);
  assert.equal(date.toISOString(), "2026-08-10T00:00:00.000Z");
});

test("parseDate rejects malformed and impossible dates", () => {
  assert.equal(parseDate("10-08-2026"), null);
  assert.equal(parseDate("2026-02-31"), null);
  assert.equal(parseDate("yesterday"), null);
  assert.equal(parseDate(20260810), null);
});

test("isWithinRange accepts a timestamp in the middle of the range", () => {
  const from = parseDate("2026-08-01");
  const to = parseDate("2026-08-10");
  assert.equal(isWithinRange("2026-08-05T12:00:00Z", from, to), true);
});
