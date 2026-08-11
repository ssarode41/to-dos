# Implementation Plan – Jira Enhancements (SCRUM-260/SCRUM-261)

This document sequences the already-created Jira work items into an executable delivery plan for the repo: https://github.com/ssarode41/to-dos

Relevant JIRA space: https://ai-automation-testing.atlassian.net

> Constraints: This plan does not invent story keys; it only references the provided stories.

---

## 1) Scope Summary
- Deliver backend support for server-side todo list filtering and sorting (status/priority/category/search/sort). (SCRUM-262, subtasks SCRUM-265–270)
- Update the frontend dashboard to provide filter/sort controls and use the API query params instead of purely client-side filtering. (SCRUM-263, subtasks SCRUM-271–274)
- Add full todo lifecycle actions: edit title/description and reopen completed todos. (SCRUM-264, subtasks SCRUM-275–279)
- Introduce backend consistency rules to keep `status` and `completed` in sync across update/complete/reopen flows. (SCRUM-277)
- Add test coverage for new API behavior and UI flows. (SCRUM-270, SCRUM-274, SCRUM-279)

---

## 2) Assumptions & Open Questions

### Assumptions
- No auth/multitenancy changes in scope; all todos remain global for the app.
- We will keep the existing endpoints backward-compatible (`GET /todos` with no query params works as today).
- Filter/sort params are optional; app defaults to current behavior when not provided.
- UI filters will drop current client-only filtering for status/priority/category, but may retain client-side debounce for the text query (`q`) to avoid excessive network calls.
- Sort options supported will be explicitly documented in `docs/api.md` and enforced via validation.

### Open questions
- What are the exact allowed values for `status` (single vs multi-value)? Expected: single value from the enum (OPEN/IN_PROGRESS/DONE).
- What are the allowed category list values? Assumed: free-text string, exact match, optionally case-insensitive.
- Sort options: SCRUM-263 AC lists “Due date” sort, but current model may not have `dueDate`; confirm whether `dueDate` exists or is out-of-scope. If absent, implement createdDate sorting only until dueDate is introduced.

---

## 3) Workstreams / Phases

| Phase | Description | Jira Stories (keys) | Dependencies | Notes |
|------|-------------|---------------------|--------------|------|
| 1. Backend list query capabilities | Add filtering/sorting support from route → controller → service → repository. | SCRUM-262, SCRUM-265, SCRUM-266, SCRUM-267, SCRUM-268 | None (params additive) | SCRUM-266 is a prereq for controller/service wiring. |
| 2. API documentation | Document new query params and examples. | SCRUM-269 | SCRUM-262 contract | Update docs as part of backend DoD. |
| 3. Backend testing for filter/sort | Integration tests for `GET /todos` with query params and validation errors. | SCRUM-270 | SCRUM-262 | Seed data across status/category/priority matrix. |
| 4. Frontend filter/sort controls | Build UI controls; connect them to API query params. | SCRUM-263, SCRUM-271, SCRUM-272, SCRUM-273 | SCRUM-262 (API supports query params) | Start with status filter aligned to enums. |
| 5. Frontend tests for filter/sort | Update Dashboard tests for new controls and behavior. | SCRUM-274 | SCRUM-263 | Prefer stable selectors and whitelisted sort options. |
| 6. Todo lifecycle: reopen + consistency | Implement reopen endpoint and enforce status/completed consistency rules. | SCRUM-264, SCRUM-276, SCRUM-277 | None (additive endpoint) | Decide auto-correct vs reject; default to auto-correct for compatibility. |
| 7. Todo lifecycle: edit + UI integration | Add edit flow and reopen action on cards; update frontend API client. | SCRUM-275, SCRUM-278 | SCRUM-276, SCRUM-277 | Show Reopen only when completed. |
| 8. Lifecycle tests (backend + frontend) | Integration/E2E tests for edit and reopen. | SCRUM-279 | SCRUM-264 | Cover inconsistent update behavior decision. |

Critical path:
- SCRUM-262 → SCRUM-263 (UI depends on API contract)
- SCRUM-276/SCRUM-277 → SCRUM-278 → SCRUM-279 (reopen end-to-end)
- SCRUM-277 → SCRUM-279 (consistency rules must be test-covered)

---

## 4) Delivery Timeline (Sprints)

> Estimates/capacity were not provided. Timeline assumes 2-week sprints with 1 full-stack dev + part-time QA automation support.

| Sprint | Goals | Jira Stories (keys) | Exit Criteria |
|------|-------|---------------------|--------------|
| Sprint 0 (Planning/API contract) | Lock API query contract + validation rules; update docs skeleton. | SCRUM-266, SCRUM-269 | Validation rules documented; docs updated with param list and examples. |
| Sprint 1 (API filter/sort + tests) | Implement server-side filter/sort end-to-end; add backend integration tests. | SCRUM-262, SCRUM-265, SCRUM-267, SCRUM-268, SCRUM-270 | Tests pass; invalid sort returns 400; default list unchanged. |
| Sprint 2 (UI filter/sort) | Add dashboard filter/sort controls and wire to API; update UI tests. | SCRUM-263, SCRUM-271, SCRUM-272, SCRUM-273, SCRUM-274 | UI sends correct query params; list updates correctly; tests pass. |
| Sprint 3 (Lifecycle: reopen + edit) | Implement reopen endpoint + consistency; add edit UI and reopen UI; add tests. | SCRUM-264, SCRUM-276, SCRUM-277, SCRUM-275, SCRUM-278, SCRUM-279 | Reopen works end-to-end; edit persists; consistency enforced; tests pass. |
| Sprint 4 (Buffer/Hardening) | Regression, docs hardening, UAT readiness, bugfixes. | (follow-up if needed) | No open P0s; release ready. |

Rationale:
- API contract must stabilize before UI can be wired (SCRUM-262 → SCRUM-263).
- Tests are written alongside API work to lock behavior early.
- Lifecycle changes are delivered as one cohesive increment (reopen + consistency + UI + tests).

---

## 5) Release & Environment Plan
- Environments: dev → test integration → UAT/stage → prod (use existing `.env.*` pattern).
- Strategy: release backend additive changes first, then frontend wiring.
- Rollback: revert deploy (service image/container tag) and/or revert frontend build; optional feature flag to disable API-driven filter/sort.

---

## 6) Test Strategy
- Unit tests (backend): validation + status/completed mapping logic (SCRUM-266, SCRUM-277).
- Integration tests (backend): list filter/sort (SCRUM-270) and reopen (SCRUM-279).
- Frontend tests: Dashboard filter/sort interactions (SCRUM-274) and edit/reopen flows (SCRUM-279).
- E2E (Playwright): smoke flow in CI (create → filter/sort → edit → complete → reopen).

Assumed Definition of Done:
- Lint/build passes.
- Tests added/updated for new behavior.
- Docs updated for new endpoints/params.
- No regression to existing flows.

---

## 7) Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation | Owner Role |
|------|--------|------------|------------|------------|
| Query param contract ambiguous | API/UI mismatch | Med | Sprint 0: document whitelist + enforce via validation. | Solution Architect / Backend Lead |
| UI performance due to refetch on each change | Slow UX | Med | Debounce `q`, avoid unnecessary fetches, cache last result. | Frontend Lead |
| Consistency rules break existing clients/data | 400s or surprise behavior | Low–Med | Default to auto-correct consistently; document behavior; add tests. | Backend Lead |
| Test flakiness due to async UI updates | CI unstable | Med | Stable selectors, seeded data, network awaits/retries. | QA Automation Engineer |
| Prod incident on cutover | User impact | Low | UAT → prod phased rollout; rollback plan; optional flag. | Delivery Lead |

---

## 8) Operational Readiness Checklist
- Logging: log sanitized query params for list calls.
- Monitoring: track 4xx/5xx rates, especially new 400 validation errors.
- Runbooks: document query params + reopen endpoint usage in `docs/api.md`.
- Support handoff: provide query examples and a test case matrix (status/priority/category/q) in release notes.
- Data migration/backfill: none expected for this scope.
