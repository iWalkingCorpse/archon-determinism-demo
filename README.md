# archon-determinism-demo

A small homelab inventory API that exists to be operated on, not used. It is
the controlled test bed for an A/B comparison between vanilla Claude Code
runs and Archon workflow runs on identical tasks.

## Layout

- `src/` — Express app: routes, validation, date helpers, in-memory store
- `tests/` — Node built-in test runner (`node --test`)
- `tasks/` — the two frozen task prompts (`bug-a.md`, `feature-b.md`).
  These are pasted verbatim into every run; do not edit them mid-experiment.
- `_scripts/` — PowerShell setup script (git init, first commit, `baseline-root` tag)

## Setup

```
npm install
npm test
```

The suite ships with **11 passing tests and 1 intentionally failing test**.
The failing test (`GET /items/search includes items added on the to date`)
captures the seeded bug that `tasks/bug-a.md` asks a run to fix. If you see
exactly one failure, the test bed is in its correct starting state.

## API

- `GET /health`
- `GET /items` — list (pagination arrives via `tasks/feature-b.md`)
- `GET /items/:id`
- `POST /items` — `{ name, category, location }`
- `GET /items/search?from=YYYY-MM-DD&to=YYYY-MM-DD` — inclusive date range
  (documented behavior; the inclusive `to` end is the seeded bug)

## Experiment rules

- Every run starts from the `baseline-root` tag.
- Fresh session per baseline run; no steering, no follow-ups.
- Prompts come from `tasks/` verbatim.
- Commit whatever a run produces — the mess is data.
