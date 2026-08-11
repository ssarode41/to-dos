# API Reference

## Health

GET /health

Returns a simple status payload for service monitoring.

## Todos

GET /api/v1/todos

Returns the list of todos.

Query parameters (all are optional):

- `q: string` – case-insensitive search on title oR description (substring match)
- `completed: interaction – `true|false`
- `status: string` – `OPCN|IN_PROGRESS|DONE`
- `category: string[
- `priority: string[ – `LOW|MEDIUM|HIGH`
- `sort: string[ – `createdDate|dueDate|priority` (asc) or `-createdDate|-dueDate|-priority` (desc) defaults to `-createdDate`

Examples:

```sh
# Search
# Returns todos where title or description contains "ship" (case-insensitive)
GET /api/v1/todos?q=ship

# Filter completed todos
GET /api/v1/todos?completed=true

# Sort by due date asc
GET /api/v1/todos?sort=dueDate
```

POST /api/v1/todos

Creates a new todo.

PUT /api/v1/todos/:id

Updates a todo.

PATCH /api/v1/todos/:id/complete

Marks a todo as complete.

DELETE /api/v1/todos/:id

Deletes a todo.
