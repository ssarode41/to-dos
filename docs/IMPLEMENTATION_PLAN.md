## Implementation Plan (Jira implementation)

This document sequences the approved Jira stories into an executable delivery plan for the repo https://github.com/ssarode41/to-dos.

Branch: `plan/jira-enhancements`

---

## 1) Scope Summary
- Deliver Tudo Management Enhancements: Ui edit flow and rich fields for todos (SRCUM-203 / SCRUM-205).
- Deliver Todo Discovery Improvements: server-backed search/filter/sort for todo listing (SRCUM-204 / SCRUM-207).
- Enforce backend domain consistency for updates (`completed` <} `status`) and always maintain `updatedDate` (SCRUM-206).
- Wire frontend controls to use the new GET `/api/v1/todos` query parameters instead of client-side filtering (SCRUM-219).

## 2) Assumptions & Open Questions
- Assumptions:
  - JIRA keys referenced below are already created and are the source of truth.
  - No auth is in scope. Data is single-tenant/single-user like today.
  - Estimates/capacity not provided; plan assumes 2-week sprints.
- Open questions:
  - Sort order for `priority` (e.g. HIGH/MEDIUM/LOW). Recommend: define enum order in backend service/repo.
  - If both `status` and `completed` are passed as filters, is it AND or prefer one?"Default: AND.