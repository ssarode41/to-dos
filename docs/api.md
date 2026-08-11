# API Reference

## Health

GET /health

Returns a simple status payload for service monitoring.

## Todos

GET /api/v1/todos

Returns the list of todos.

Optional query parameters (server-side search/filter):
- q: case-insensitive substring match on title
- completed: true|false
- status: OPEN|DONE
- category: e.g. GENERAL, WORK
- priority: e.g. LOW|MEDIUM|HIGH

POST /api/v1/todos

Creates a new todo.

PUT /api/v1/todos/:id

Updates a todo.

PATCH /api/v1/todos/:id/complete

Marks a todo as complete.

PATCH /api/v1/todos/:id/reopen

Reopens a completed todo (sets completed=false, status=OPEN).

DELETE /api/v1/todos/:id

Deletes a todo.
