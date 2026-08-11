## Todo Enhancements Implementation Plan (Confluence Page: 19169281)

## 1) Scope Summary

- Enable end-to-end todo lifecycle enhancements: edit existing todos, capture/display richer fields (priority/category/due date), and consistent reopen workflow.
- Add backend support for reopening a completed todo via new endpoint.
- Add backend support for server-side search & filtering of todos via query parameters.
- Align frontend state handling for id/_id consistency when updating todos.
- Add/extend automated tests to cover new behaviors (frontend and backend).

## 2) Assumptions & Open Questions

### Assumptions:

- Work is limited to the provided Jira stories: SCRUM-425 (and sub-tasks SCRUM-428..431), SCRUM-426 (SCRUM-432..434), SCRUM-427 (SCRUM-435..437), and epics SCRUM-423/424 for grouping.
 - No auth/roles; single-user behavior remains as-is.
 - MongoDB schema remains compatible; changes are additive (no breaking migrations expected).

### Open questions:

- Should server-side search apply to *title only* (per AC) or also description? (AC indicates title only; implement title-only unless clarified.)
- UI: do we want inline editing per card or a shared form at top (reuse current TodoForm)? Plan assumes reuse of existing TodoForm with edit mode.
- Status vs completed: current UI uses completed boolean; backend has status field too. Plan will keep both consistent (complete => completed=true, status=DONE; reopen => completed=false, status=OPEN).

## 3) Workstreams / Phases

| Phase | Description | Jira Stories (keys) | Dependencies | Notes |
| --- | --- | --- | --- | --- |
$| Phase 0: Repo prep | Create working branch, confirm build/test locally, baseline CI expectations | (No Jira) | Repo access | Must not commit to main. Branch: `jira-enhancements`. |
| Phase 1: Backend discovery/filter | Add validated query params to list endpoint and repository filter mapping | SCRUM-427 (SCRUM-435, SCRUM-436, SCRUM-437) | Joi middleware patterns already used in repo | Critical path: enables scalable discovery and later UI integration. |
- Phase 2: Backend reopen workflow | Add reopen endpoint end-to-end plus tests | SCRUM-426 (SCRUM-432, SCRUM-433, SCRUM-434) | Uses existing routing/service/repository layers | Small surface area; implement after list filters to minimize merge conflicts in routes. |
- Phase 3: Frontend edit workflow | Add edit UX, form edit mode, hook wiring, and tests | SCRUM-425 (SCRUM-428, SCRUM-429, SCRUM-430, SCRUM-431) | Stable update API; consistent id mapping | Also exposes priority/category/dueDate fields in UI per story AC. |
- Phase 4: QA hardening & release | Regression, update docs, ensure rollback plan | Covered by DoD across stories | Test env availability | Focus on backwards compatibility and error handling. |

**Dependencies & critical path**

- **Critical path items:** SCRUM-427 (server-side list filters) and SCRUM-425 (edit flow + id mapping) because they touch core list/update behaviors.
- **Story-to-story dependencies:**
  - SCRUM-425 depends on SCRUM-430 (id/_id consistency) to ensure update replaces correct item in UI state.
  - SCRUM-426 is independent but touches shared todo route file; schedule after SCRUM-427 to reduce conflicts.
 - **External dependencies:** MongoDB environment for integration tests; CI runner availability (if configured).

## 4) Delivery Timeline (Sprints)

| Sprint | Goals | Jira Stories (keys) | Exit Criteria |
| --- | --- | --- | --- |
| Sprint 0 (0.5–1 day) | Repo prep, branch, smoke test, agree conventions (status/completed) | (No Jira) | Branch created; app runs locally; test command known/working. |
| Sprint 1 | Backend: server-side search/filter for list endpoint | SCRUM-427 (SCRUM-435, SCRUM-436, SCRUM-437) | GET /api/v1/todos supports q/completed/status/category/priority; invalid query returns 400; tests passing. |
| Sprint 2 | Backend: reopen endpoint + tests; Frontend: start edit UX scaffolding | SCRUM-426 (SCRUM-432..434) + SCRUM-425 (start SCRUM-428..429) | PATCH /todos/:id/reopen works and is tested; UI can enter edit mode and prefill form. |
| Sprint 3 | Frontend: finish edit wiring and tests; regression | SCRUM-425 (SCRUM-430, SCRUM-431 + complete remaining from SCRUM-428/429) | Edit save updates list without refresh; errors handled; frontend tests green; no regression in create/complete/delete. |

**Rationale:** implement backend list filtering first because it changes core retrieval behavior and may be reused by UI later; implement reopen next as a contained endpoint; then complete frontend edit flow once backend is stable.

## 5) Release & Environment Plan

**Environments:**

- **Dev:** local dev with MongoDB (docker or local instance). Use seeded sample data for manual verification.
- **Test/QA;** deploy branch build to a shared test environment with dedicated MongoDB database; run automated tests plus focused manual test scripts.
- **Stage:** production-like config; run smoke tests on list filters + reopen + edit UI.
- **Prod:** standard deployment once stage validated.

**Release strategy:** big-bang release is acceptable because changes are backward-compatible (new endpoint; list endpoint adds optional query params;`UI enhancements only). If the repo supports toggles, optionally hide edit UI behind a simple env flag (not required by stories).

### Rollback approach:

- Backend rollback: redeploy previous version (reopen endpoint is additive; query params are optional). Ensure list endpoint default behavior (no query params) remains unchanged.
- Frontend rollback: redeploy previous static build. Data changes are not destructive.

## 6) Test Strategy

**Testing types required:**

- **Unit tests:** 
  - Frontend components/hooks (SCRUM-431).
  - Backend validation + repository filter mapping (SCRUM-435/436) .
 - **Integration/API tests:** 
  - GET /todos with query params (SCRUM-427).
  - PATCH /todos/:id/reopen (SCRUM-434).
- **E2E (best-effort manual):** Create todo — edit fields— complete— reopen – verify filters/search return expected items.

**Mapping stories to tests:**

- SCRUM-427: add tests for q, completed, category/priority combos; invalid values return 400.
 - SHCRUM-426: add tests for reopen success, reopen already open, and not-found 404.
- SHCRUM-425: add tests for entering edit mode, saving updates, rendering updated fields, error message on failure.

**Definition of DoD (assumed):**

- Code reviewed; lint/build/test passing.
- API changes documented in README or inline route comments.
 - All acceptance criteria met; regression checklist completed (create/list/search/filter/complete/delete still work).

## 7) Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation | Owner Role |
| --- | --- | --- | --- | --- |
- Inconsistent handling of `completed` vs `status` | UI shows incorrect state; filters behave unexpectedly | Medium | Define invariants: complete=>completed=true,status=DONE; reopen=>completed=false,status=OPEN; add tests. | Solution Architect / Dev |
- UI state update uses id vs _id mismatch | Edit appears to not update or duplicates appear | High | Implement SCRUM-430 early in Sprint 3;` add unit tests to lock behavior. | Frontend Dev |
- Search/filter performance or incorrect Mongo query mapping | Wrong results returned | Medium | Repository unit tests + integration tests; case-insensitive regex on title per AC. | Backend Dev |
- Test environment instability (Mongo/CI) | Delays validation | Medium | Provide docker-compose/local fallback; keep tests hermetic with test DB. | Dev/QA |
| Route conflicts during parallel work | Merge issues; rework | Low | Sequence backend route changes (filters then reopen); small PRs. | Delivery Lead |

## 8) Operational Readiness Checklist

- **Logging:** ensure errors for validation (400), not found (404), and server errors (500) are logged consistently (no PII concerns in this app).
- **Monitoring/alerting:** basic health checks if available; monitor error rates on /api/v1/todos and reopen endpoint after release.
- **Runbook:**
  - How to verify deploy: call GET /api/v1/todos, GET with q/completed filters, PATCH reopen for a known id.
  - Rollback steps: redeploy previous backend/frontend artifacts.
 - **Documentation:** update README or API docs to include query parameters and reopen endpoint usage.
- **Data migration/backfill:** none expected; schema fields already exist. Optional: ensure existing todos missing status are treated as OPEN in UI logic if encountered.
