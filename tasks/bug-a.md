# Bug: date-range search excludes items added on the end date

`GET /items/search?from=YYYY-MM-DD&to=YYYY-MM-DD` is documented as an
inclusive range on both ends, but items added on the `to` date are missing
from the results.

Reproduce:

```
GET /items/search?from=2026-08-01&to=2026-08-10
```

Expected: 4 items (DGX Spark, UPS 1500VA, Kindle Paperwhite 2, Zigbee
coordinator). Actual: 2 items — both items added on 2026-08-10 are dropped.

The test suite has one failing test that captures this
(`GET /items/search includes items added on the to date`).

Fix the bug so the full test suite passes. Do not change the test.
