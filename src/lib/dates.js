// Date helpers shared by validation and the data store.

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Parse a YYYY-MM-DD string into a Date at midnight UTC.
 * Returns null for anything that isn't a real calendar date.
 */
export function parseDate(value) {
  if (typeof value !== "string" || !DATE_ONLY.test(value)) {
    return null;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  // Reject rollovers like 2026-02-31 -> March 3.
  if (date.toISOString().slice(0, 10) !== value) {
    return null;
  }
  return date;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * True when the timestamp falls inside the [from, to] range.
 * `toDate` is midnight UTC of the `to` day, so the exclusive upper bound
 * is midnight UTC of the day after `to` - this keeps the whole `to` day inclusive.
 */
export function isWithinRange(timestamp, fromDate, toDate) {
  const t = new Date(timestamp).getTime();
  return t >= fromDate.getTime() && t < toDate.getTime() + ONE_DAY_MS;
}

/**
 * Format a Date back to YYYY-MM-DD for responses.
 */
export function toDateString(date) {
  return date.toISOString().slice(0, 10);
}
