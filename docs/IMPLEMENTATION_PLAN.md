# Ira Enhancements – Implementation Plan

Branch: `plan/jira-enhancements`
Repo: https://github.com/ssarode41/to-dos

This plan sequences the already-created Jira items into an executable delivery approach for the To-Dos full-stack app. It is written to be directly actionable by engineering and QA.

---

## 1) Plan created
This document is the implementation plan for the approved Jira enhancements. It is committed to a new branch and present in the remote repository.

---

## 1) Scope Summary
- Ship a full end-user "Edit Todo" experience in the React UI using the existing `PUT /api/v1/todos/:id` backend endpoint. (SCRUM-240/SCRUM-243/SCRUM-244/SCRUM-245)
- Expose todo metadata in the create flow (priority, category, status, due date) and display dueDate in the list. (SCRUM-241/SCRUM-246/SCRUM-247/SCRUM-248)
- Add server-side GET /todos querying: filters, text search (q), deterministic sorting, and pagination with metadata. (SCRUM-242/SCRUM-249/SCRUM-250/SCRUM-251/SCRUM-252)
- Deliver with appropriate test coverage (unit/integration/e2e), release safeguards, and a rollback plan.

## 2) Assumptions & Open Questions

* Assumptions:
- Story keys are limited to the provided set: SCRUM-238, SCRUM-239, SCRUM-240, SCRUM-241, SCRUM-242, and SCRUM-243–252.
- No auth or multi-user scoping in this enhancement batch.
- Backend remains Node/Express + MongoDB; frontend remains React *No major reframework changes*.

* Open questions:
- (SCRUM-251) When pagination is implemented, should GET /todos always return an envelope `{`items`, ...}, or only when `page|limit are present? Forward-compat option: envelope always, update feult consumers.
  - Recommendation: Return envelope always and update frontend callers in this sprint.