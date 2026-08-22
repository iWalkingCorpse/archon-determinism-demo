import { Router } from "express";
import * as db from "../db.js";
import { validateItem, validateRange, validatePagination } from "../lib/validate.js";
import { itemResponse, listResponse, paginatedListResponse, errorResponse } from "../lib/format.js";

const router = Router();

// GET /items?page=1&limit=20 — paginated list
router.get("/", (req, res) => {
  const result = validatePagination(req.query);
  if (!result.ok) {
    return res.status(400).json(errorResponse(result.errors));
  }
  const { page, limit } = result.value;
  const offset = (page - 1) * limit;
  const { items, total } = db.paginate(offset, limit);
  res.json(paginatedListResponse(items, { total, page, offset }));
});

// GET /items/search?from=YYYY-MM-DD&to=YYYY-MM-DD — items added in a date range (inclusive)
router.get("/search", (req, res) => {
  const { from, to } = req.query;
  const result = validateRange(from, to);
  if (!result.ok) {
    return res.status(400).json(errorResponse(result.errors));
  }
  const { fromDate, toDate } = result.value;
  res.json(listResponse(db.findInRange(fromDate, toDate)));
});

// GET /items/:id — single item
router.get("/:id", (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const item = Number.isNaN(id) ? null : db.byId(id);
  if (!item) {
    return res.status(404).json(errorResponse("item not found"));
  }
  res.json(itemResponse(item));
});

// POST /items — add an item
router.post("/", (req, res) => {
  const result = validateItem(req.body);
  if (!result.ok) {
    return res.status(400).json(errorResponse(result.errors));
  }
  const item = db.insert(result.value);
  res.status(201).json(itemResponse(item));
});

export default router;
