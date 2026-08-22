# Feature: pagination for GET /items

Add pagination to `GET /items` via query parameters:

- `page` — 1-based page number, default `1`
- `limit` — items per page, default `20`, maximum `100`

Response shape (existing fields unchanged for each item):

```json
{
  "count": <number of items on this page>,
  "total": <total items across all pages>,
  "page": <current page>,
  "hasMore": <true when a later page exists>,
  "items": [ ... ]
}
```

Validation:

- `page` and `limit` must be positive integers when supplied; respond
  `400` with the standard `{ "errors": [...] }` shape otherwise.
- `limit` above 100 is a validation error, not a silent clamp.
- A `page` beyond the last page is not an error: respond `200` with an
  empty `items` array and `hasMore: false`.

Include tests covering: defaults, a custom page/limit, the final-page
`hasMore` transition, `page` beyond the end, and validation failures
(including `limit=0` and `limit=101`). The existing test suite must
continue to pass unchanged.
