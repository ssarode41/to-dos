# API Reference

## Health

GET /health

Returns a simple status payload for service monitoring.

## Todos

GET /api/v1/todos

Returns the list of todos.

Query parameters (optional):
- `: string — case-insensitive title contains search
- completed: boolean ("true" | "false")
- priority: LOW | MEDIUM | HIGH
- status: OPEN | IN_PROGRESS | DONE
- category: string
- sort: <field>:<asc|desc> (e.g. createdDate:desc)

Simple examples:
- GET /api/v1/todos?q=ship
- GET /api/v1/todos?completed=false
- GET /api/v1/todos?priority=HIGH&sort=createdDate:desc

POST /api/v1/todos

Creates a new todo.

PUT /api/v1/todos::id


Updates a todo.

PATCH /api/v1/todos/:id/complete

Marks a todo as complete.

DELETE /api/v1/todos::id


Deletes a todo.
