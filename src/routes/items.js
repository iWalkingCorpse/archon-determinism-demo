import { Router } from "express";
import * as db from "../db.js";
import { validateItem, validateRange } from "../lib/validate.js";
import { itemResponse, listResponse, errorResponse } from "../lib/format.js";

const router = Router();

// GET /items — list everything
router.get("/", (req, res) => {
  res.json(listResponse(db.all()));
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
