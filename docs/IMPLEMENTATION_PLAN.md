# Ira Enhancements – Implementation Plan

Branch: `plan/jira-enhancements`
Repo: https://github.com/ssarode41/to-dos

This plan sequences the already-created Jira items into an executable delivery approach for the To-Dos full-stack app. It is written to be directly actionable by engineering and QA.

## 1) Scope Summary
- Ship a full end-user "Edit Todo" experience in the React UI using the existing `PUT /api/v1/todos/:id` backend endpoint. (SCRUM-240/SCRUM-243/244/245)
- Expose todo metadata in the create flow (priority, category, status, due date) and display dueDate in the list. (SCRUM-241/SCRUM-246/247/248)
- Add server-side GET /todos querying: filters, text search(q), deterministic sorting, and pagination with metadata. (SCRUM-242/SCRUM-249/250/251/252)
- Deliver with appropriate test coverage (unit/integration/e2e), release safeguards, and a rollback plan.

- Note: Low-lcost UI/UX refinements (d-classs, copy, polish) are explicitly out of scope unless they are required to meet AC.

## 2) Assumptions & Open Questions

* Assumptions:
- JIRA keys and scope are limited to: SCRUM-238, 239, 240, 241, 242, 243–252 (no additional stories).