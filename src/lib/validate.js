// Request validation. Each validator returns { ok, errors?, value? }.

import { parseDate } from "./dates.js";

const CATEGORIES = ["gpu", "compute", "storage", "display", "power", "iot", "network"];

export function validateItem(body) {
  const errors = [];

  if (typeof body?.name !== "string" || body.name.trim().length === 0) {
    errors.push("name is required");
  } else if (body.name.length > 80) {
    errors.push("name must be 80 characters or fewer");
  }

  if (!CATEGORIES.includes(body?.category)) {
    errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
  }

  if (typeof body?.location !== "string" || body.location.trim().length === 0) {
    errors.push("location is required");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    value: {
      name: body.name.trim(),
      category: body.category,
      location: body.location.trim()
    }
  };
}

export function validateRange(from, to) {
  const errors = [];
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate) {
    errors.push("from must be a valid YYYY-MM-DD date");
  }
  if (!toDate) {
    errors.push("to must be a valid YYYY-MM-DD date");
  }
  if (fromDate && toDate && fromDate.getTime() > toDate.getTime()) {
    errors.push("from must be on or before to");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }
  return { ok: true, value: { fromDate, toDate } };
}
