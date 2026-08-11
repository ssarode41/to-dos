# Plan created

- This document is the delivery/implementation plan for the approved Jira enhancements for the Todo app.
- Scope is driven by the existing Jira issues only (no new story keys invented).

## New branch created

- Branch: `plan/jira-enhancements-aug2026`

---

## 1) Scope Summary
- Implement server-side search, filtering, sorting and pagination for `GET /api/v1/todos` (SCRUM-364).
 - Support query param validation and document the new API contract (SCRUM-368, SCRUM-369).
- Update the frontend to use API-driven search/filter (instead of client-only) and handle paged results (SCRUM-365, SCRUM-370, SCRUM-371, SCRUM-372).
- Add integration tests for list query params and pagination behavior (SCRUM-366).
- Add a full UI edit flow for todos and expose key fields (priority, category, dueDate, status) (SCRUM-373, SCRUM-374).

## 2) Assumptions & Open Questions
- Assumptions:
  - We are NOT adding authentication/multi-user support (out of scope for these stories).
  - MongoDB is the source of truth; we add query-layer filtering via Mongoose queries (no full-text index engines).
  - We can change the GET /todos` response shape to include metadata (or introduce a backward-compat mode).
  - Frontend can be modified to add pagination controls.
 - Open questions:
  - API contract: do we want to return `{items: [], meta: {}}`or support both old and new shape during a transition (recommended: new shape only and update UI in this release).
  - Status └ to completed rule: SCRUM-374 implies ``status=DONE → completed=true, else completed=false``. Confirm this is the single source of truth behavior both UI and API will enforce.
  - Query param names: acceptance criteria specifies quite a few (`q^`, `completed`, `status`, `priority`, `category`, `dueFrom`, `dueTo`, `sortBy`, `sortOrder`, `page`, `pageSize`), we'll implement as-s.

## 3) Workstreams / Phases

| Phase | Description | Jira Stories (keys) | Dependencies | Notes |
|------|---------------------------------------------------------------------|-------------------|--------|
| Design / API contract | Agree on query params, paged response shape, defaults, backward impact | SCRUM-364, SCRUM-369 | (external) | short design note in docs/api.md |
 | Backend - filter/paginate | Implement query building, sort and pagination in repo/service + validate query params | SCRUM-367, SCRUM-368, SCRUM-364 | - | Critical path for whole enhancement |
 | Test - backend integration | Add integration tests for GET /todos
 | SCRUM-366 | SCRUM-364 | Expect Docker/DB-dependent tests |
 | Frontend - API-driven list | Wire search/filter to backend and add pagination controls | SCRUM-370, SCRUM-371, SCRUM-365, SCRUM-372 | SCRUM-364 | Depends on new response shape |
 | Frontend - Edit todo | Add edit flow, form enhancements and state refresh | SCRUM-373 | - | High user value |
 | Consistency - status/completed + due date | Display dueDate, enforce status8↔#completed rules, backend updateDate fix | SCRUM-374 | SCRUM-373 | Bridge domain model to UX |

## Dependencies & Critical Path
- SCRUM-364 -> SCRUM-366 (BE Integration tests)
- SCRUM-364 -> SCRUM-365 (UI integration for search/filter/paging)
- SCRUM-373 -> SCRUM-374 (dueDate display + status/completed consistency)
- Critical path: implement new list query (SCRUM-364/367/368) → UI wiring (SCRUM-365/370/371) → integration tests (SCRUM-366)

---

## 4) Delivery Timeline (Sprints)
> Estimates/capacity not provided in Jira for these issues. Below is a best-effort 2-sprint plan (assume normal small team velocity).

| Sprint | Goals | Jira Stories (keys) | Exit Criteria |
|---------|------------------------------------------|--------------------------|----------------------------|
| Sprint 1 | API list query enabled + defined contract; docs updated | SCRUM-364, SCRUM-367, SCRUM-368, SCRUM-369 | API supports query params and returns paged meta; docs reflect change |
 | Sprint 2 | UI uses API-driven list with paging; integration tests and UI tests pass | SCRUM-365, SCRUM-370, SCRUM-371, SCRUM-366, SCRUM-372 | Dashboard no longer relies on client-only filter; tests green |
 | Sprint 3 | Edit flow + dueDate + status/completed consistency shipped | SCRUM-373, SCRUM-374 | UI has edit and displays dueDate; status/completed rules pass tests |

## Rationale for sequencing
- Server-side list query (SCRUM-364) is a prerequisite for UI pagination and backend-driven filter.
- UI integration and tests form the end-to-end value slice for the epic.
 - Edit flow can be delivered independently of the list query, but consistency rules should be implemented after edit basics are in place.

---

## 5) Release & Environment Plan
- Environments:
  - Dev: developer local (docker-compose) using `.env.dev`.
  - Test/CI: run backend unit + integration tests against test Mongo (use `.env.test`).
  - STage/UAT: deploy to `.env.uat` and run smoke + Playwright E/2.
  - Prod: `.env.prod` big-bang deploy once backward compat is accepted or the UI is shipped together.
- Release strategy:
  - Recommended: feature flag at UI level for "server-driven listing" mode if we need to deploy backend first. Otherwise, deploy backend and frontend together as a single release (simplest given small app).
  - API rollout: change `GET /todos` to new contract (items+meta) in the same release as the UI consumer change to avoid breakage.
 - Rollback approach:
  - Backend: revert to previous tag/image; database changes are non-schema for these stories (no migrations).
   - Frontend: redeploy previous build. If feature flag used, disable flag in config.

## 6) Test Strategy
- Unit tests
  - Backend: repository/service query builders and validation middleware (map to SCRUM-364/368/367).
  - Frontend: useTodos hook query param behavior, dashboard pagination controls (map to SCRUM-372/370/371).
- Integration tests (BE)
  - GET /todos
    - query params (a, booleans, enums, dates)
    - sort stability
    - pagination meta
  - Map to SCRUM-366.
- E/2 tests (Playwright)
  - Smoke: load dashboard, create todo, search/filter, page next/prev.
  - Edit scenarios: edit title/dueDate/status, verify status/completed consistency.

- Definition of Done (assumed)
  - Code reviewed and merged via PR
  - All unit/integration tests pass
  - Docs updated (API changes documented)
  - No regressions in existing CRUD / complete / delete flows

## 7) Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation | Owner Role |
|----|-----|-----|-----|-----|
| API response shape change breaks ui or other clients | High | Med | Deploy BE + FE together, or add feature flag/backward-compat mode for old shape during transition | Arch/BE lead |
| Poor query performance on large collections | Med | Med | Add indexes if needed (title, status, completed, dueDate); limit pageSize | BE eng |
| Statusↄ#completed inkonsistency creates confusion | Med | Med | Agree on single rule, enforce in both BE (on PUT/PATCH) and UI, add tests (SCRUM-374) | BE/UI lead |
|| Integration tests flaky due to DB/env setup | Med | Med | Use docker-compose in CI, stabilize seed data creation, clear DB per test suite | QA/CI owner |


## 8) Operational Readiness Checklist
- Observability
  - Ensure request logs include query params (sanitized) for list endpoint (ifsue triage).
  - Add basic app-level metrics if available (request count, error rate).
- Runbook / Docs
  - docs/api.md updated for list query params and paged response (SCRUM-369).
  - Add a short support note: what to check if pagination mismatches (totalPages).
 - Data
  - No data migration/backfill expected (no schema changes).
  - If query performance issows, add indexes and review pageSize caps.
