# Jira Enhancements – Implementation Plan

Repo: https://github.com/ssarode41/to-dos
Full Plan (Confluence): https://ai-automation-testing.atlassian.net/wiki/spaces/~712020749f6b1e88d14e048e9072983925fd65/pages/19169281/Plan
Branch: `jira-enhancements`

**Stories in scope:** SCRUM-440, SCRUM-441, SCRUM-442, SCRUM-443, SCRUM-444, SCRUM-445

## 1) Scope Summary
- Add an Edit Todo user experience in the dashboard, leveraging existing backend update API.
- Enhance create/edit forms to capture and persist priority, category, due date (currently hardcoded/unused in UI).
- Implement server-side searching/filtering for the list endpoint and add automated integration test coverage.
- Introduce an optional pagination response contract for the list API (backward compatible when not used).

## 2)- Assumptions & Open Questions
Assumptions:
- Existing endpoints remain authoritative: PUT�/api/v1/todos/:id, GET /api/v1/todos.
  - Pagination is backward-compatible: without page/limit, return an array as today; with page/limit, return an object with items + metadata.
- No auth changes; createdBy remains defaulted.

Open questions:
 - Query param contract: proposed `q`, `completed`, `priority`, `category`, and optional `page`/`limit`.
 - Due date format: recommend ISO string in payload, localized display.

## 3) Workstreams / Phases
| Phase | Description | Jira Stories (keys) | Dependencies | Notes |
|------|-----------------------------------|------------------------------------------------|-----------------------------------------------|
 | Phase 0 – Planning & design | Confirm API/UI contracts, test approach, sequencing. | SCRUM-443, SCRUM-440, SCRUM-441 | Stakeholder agreement | Lightweight decisions: query params, pagination shape, UI edit pattern. |
 | Phase 1 – Backend query enhancements | Enable server-side filters/search; backward compatible array response. | SCRUM-443 | Phase 0 decisions | Critical path for testability and future UI scalability. |
 | Phase 2 – Backend pagination (optional) | Add page/limit support with total count metadata. | SCRUM-444 | SCRUM-443 | Only change response shape when pagination params present. |
| Phase 3 – Frontend UX enhancements | Edit flow + create/edit metadata fields and display. | SCRUM-440, SCRUM-441 | Existing POST/PUT endpoints | Can run in parallel after contracts are stable. |
 | Phase 4 – QA automation | Backend integration tests and UI tests for create/edit. | SCRUM-445, SCRUM-442 | SCRUM-443, SCRUM-440, SCRUM-441 | Regression coverage for new behaviors. |

**Dependencies**
 - SCRUM-444 → SCRUM-443
 - SCRUM-445 → SCRUM-443
 - SCRUM-442 → SCRUM-440, SCRUM-441

**Critical path**: SCRUM-443 → SCRUM-445 (parallel after) + SCRUM-440/SCRUM-441 → SCRUM-442.

## 4) Delivery Timeline (Sprints)
No estimates/capacity were provided; assume 2-week sprints with 1 BE + 1 FE engineer and QA support.

| Sprint | Goals | Jira Stories (keys) | Exit Criteria |
|-------|--------------------------------------|------------------------------------------------|-----------------------------------------------|
 | Sprint 1 | Backend query support + start tests; start FE metadata form. | SCRUM-443, SCRUM-445 (start), SCRUM-441 (start) | API query params work; core integration tests green; create form captures metadata. |
 | Sprint 2 | Finish FE edit flow + UI automation; finish BE tests; optional pagination. | SCRUM-440, SCRUM-441 (finish), SCRUM-442, SCRUM-445 (finish), SCRUM-444 (optional) | Edit flow end-to-end; UI automation passes; backend tests complete; pagination backward compat if delivered. |

## 5) Release & Environment Plan
- Environments: Dev → Test → (/stage) → Prod.
  - BE deploy first (query/pagination backward compat).
  - FE deploy after BE is available.

- Release strategy: Backward-compatible rollout.
  - List endpoint keeps array response by default; pagination object only when `page/limit` present.

- Rollback: Redeploy prior builds. If pagination shipped, clients can stop sending `page/limit` to return to array shape.

## 6) Test Strategy
- FE unit/component tests: SCRUM-440, SCRUM-441
- BE integration/toutes tests: SCRUM-443, SCRUM-444, SCRUM-445
- UI! automation: SCRUM-442

Dod (assumed):
 - PR approved, CI green, lint/test passing.
 - API contract/docs updated for new query/pagination behavior.

## 7) Risks & Mitigations
| Risk | Impact | Likelihood | Mitigation | Owner Role |
|------|--------|-----------|-----------------------------|--------------------|
| API response shape breaking clients | High | Medium | Keep default array response; paginate only when `page/limit` present; test both modes. | BE engineer |
| Query param semantics unclear | Medium | Medium | Doc semantics; add integration tests for case-insensitive `q` and combined filters. | Solution Architect / BE |
| UI edit state regressions | Medium | Medium | Centralize update in hook; add save/cancel tests. | FE engineer |
| Date format/timezone issues | Low-Medium | Medium | Standardize to ISO; localize display; test presence/absence. | FE / QA |

## 8) Operational Readiness Checklist
- Logging: debug-level log of query params (minimal, no PII).
 - Monitoring: track error rates and latency for GET /todos.
- Runbook: query/pagination troubleshooting and rollback steps.
- Docs: update API docs for query params and pagination examples.
- Data migration: none.
