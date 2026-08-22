import { test } from "node:test";
import assert from "node:assert/strict";
import { parseDate, isWithinRange } from "../src/lib/dates.js";

test("isWithinRange includes a timestamp at the very end of the to date", () => {
  const from = parseDate("2026-08-01");
  const to = parseDate("2026-08-10");
  assert.equal(isWithinRange("2026-08-10T23:59:59.999Z", from, to), true);
});

test("isWithinRange excludes a timestamp at midnight of the day after to", () => {
  const from = parseDate("2026-08-01");
  const to = parseDate("2026-08-10");
  assert.equal(isWithinRange("2026-08-11T00:00:00.000Z", from, to), false);
});

test("isWithinRange includes a timestamp exactly at the from boundary", () => {
  const from = parseDate("2026-08-01");
  const to = parseDate("2026-08-10");
  assert.equal(isWithinRange("2026-08-01T00:00:00.000Z", from, to), true);
});
