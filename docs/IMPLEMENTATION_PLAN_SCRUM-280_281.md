# Plan created

## 1) Scope Summary
- Deliver approved Jira enhancements for the Todos app covering edit capabilities, due date/status lifecycle management, and server-side search/filter/sort/pagination.
- Add UI support to edit existing todos in-place (title, description, priority, category) using existing backend PUT endpoint.
- Extend create/edit/display flows to support dueDate and status (OPEN/IN_PROGRESS/DONE) end-to-end.
- Implement backend GET /api/v1/todos query parameters (q/completed/status/page/limit/sort) including total count + metadata and update API documentation.
- Add/extend automated tests (React unit/RTL, backend integration/supertest, basic e2e smoke) for the new behaviors.

## 2) Assumptions & Open Questions
- Assumptions:
  - Single-user app (no auth); `createdBy` remains as-is.
  - MongoDB schema already contains priority/category/status/dueDate fields; changes are additive (no migration required).
  - Team will accept 2-week sprints; capacity/estimates are not provided.
- Open questions:
  - Should GET /todos response shape change to `{ items, meta }` (breaking) or should we maintain backward compatibility via a flag (recommended)?
  - Confirm canonical status values: `OPEN | IN_PROGRESS | DONE`.
  - Should `completed` be the source of truth, or derived from status==DONE? (Recommend keeping both consistent; complete endpoint sets both.)

## 3) Workstreams / Phases
| Phase | Description | Jira Stories (keys) | Dependencies | Notes |
|------|-------------|---------------------|--------------|------|
| 0. Planning/contract | Confirm API response shape + rollout approach; align on test approach | SCRUM-280, SCRUM-281, SCRUM-282, SCRUM-283, SCRUM-284 | None | Decide backwards-compat approach for SCRUM-284 in Sprint 0 |
| 1. UI edit capability | Add edit entry point + edit form state + update wiring for title/description/priority/category | SCRUM-282 | None | Critical path for SCRUM-283 UI reuse |
| 2. DueDate + Status E2E | Add dueDate/status fields to create/edit/display; backend updateDate consistency on PUT | SCRUM-283 | SCRUM-282 | Ensure updatedDate set on generic updates |
| 3. API query/pagination | Add query params support (q/completed/status/page/limit/sort) + meta + docs + tests | SCRUM-284 | Contract decision from Phase 0 | Treat as contract change; include integration tests + docs |

Dependencies:
- SCRUM-283 depends on SCRUM-282 for shared edit flow.
- SCRUM-284 can be implemented independently, but contract decision must be made early.

Critical path:
- SCRUM-282 → SCRUM-283 (UI) and SCRUM-284 (API contract + tests).

## 4) Delivery Timeline (Sprints)
> Estimates/capacity not provided; plan assumes 2-week sprints with 1 FE + 1 BE + QA support.

| Sprint | Goals | Jira Stories (keys) | Exit Criteria |
|-------|-------|---------------------|--------------|
| Sprint 0 (prep) | Confirm API response shape + compatibility strategy; align on DoD/test matrix | SCRUM-280, SCRUM-281 | Decision documented in repo; CI green |
| Sprint 1 | Deliver edit-todo UI E2E | SCRUM-282 | User can edit title/description/priority/category; UI validation for empty title; tests green |
| Sprint 2 | Deliver dueDate + status create/edit/display and backend updatedDate consistency | SCRUM-283 | dueDate/status persisted and visible; PUT updates updatedDate; integration tests green |
| Sprint 3 | Deliver server-side search/filter/sort/pagination + docs/tests | SCRUM-284 | GET /todos supports query params; meta/total included per contract; docs updated; integration tests green |

Rationale:
- Build UI edit first to avoid duplicating form work.
- Add dueDate/status next as incremental fields with minimal API risk.
- Deliver pagination/query in dedicated sprint due to API contract + broader test surface.

## 5) Release & Environment Plan
- Environments: dev → test (CI) → uat/stage → prod.
  - Dev: docker-compose (Mongo) + local FE/BE.
  - Test: CI runs lint/unit + backend integration tests.
  - UAT/Stage: deploy from main; run smoke + e2e.
  - Prod: release from main with version tagging.

- Release strategy:
  - UI: optionally feature-flag edit/dueDate/status via env var/build-time flag if phased rollout desired.
  - API (SCRUM-284): recommend backward compatibility to avoid breaking the existing UI. Options:
    - Keep returning array by default, return `{items, meta}` when `meta=true`.
    - Or use `shape=v2` query param during transition.

- Rollback:
  - Revert to previous release tag/commit.
  - Disable feature flags.
  - DB rollback not required (additive fields only).

## 6) Test Strategy
- Unit/Component (Frontend):
  - SCRUM-282: edit mode open/cancel/save; empty title blocked.
  - SCRUM-283: dueDate/status inputs present; display badges.

- Integration (Backend, supertest):
  - SCRUM-283: create + update with dueDate/status; verify persisted values; updatedDate updated on PUT.
  - SCRUM-284: GET with q filter, completed/status filters, page/limit boundaries, sort ordering; verify total/meta.

- E2E (Playwright smoke):
  - Create → Edit → Set dueDate/status → Complete; ensure UI reflects changes.

Definition of Done (assumed):
- Code reviewed, tests green, docs updated, no regressions to create/complete/delete.

## 7) Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation | Owner Role |
|------|--------|------------|------------|------------|
| GET /todos response shape change breaks UI | High | Medium | Backward-compatible contract (meta flag / v2 param); update docs; add contract tests | Solution Architect |
| id vs _id mapping causes edit state update bugs | Medium | Medium | Standardize on `_id` in FE model mapping and API client; add tests | FE Lead |
| status/completed dual source of truth | Medium | Medium | Define precedence; ensure complete endpoint sets both; validate in tests | Product Owner + Architect |
| pagination/count performance for large collections | Medium | Low | Add indexes (title, createdDate); cap limit; log slow queries | BE Lead |

## 8) Operational Readiness Checklist
- Update docs/api.md with GET /todos query params and response examples (SCRUM-284).
- Add UAT checklist covering edit + dueDate/status + query params.
- Ensure logs capture query param parsing errors (400s) and slow query warnings.
- Optional: backfill script to set `status=OPEN` for legacy documents with null status.
