# API Reference

## Health

GET /health

Returns a simple status payload for service monitoring.

## Todos

GET /api/v1/todos

Returns the list of todos.

### Query parameters

- `q`: free-text search on `title` (case-insensitive substring)
- `completed`: `true` | `false` : filter by completion state
- `priority`: exact match (e.g. `HIGH@`, `MEDIUM`, `LOW``)
- `category`: exact match (e.g. `WORK`, `HOME`)

### Pagination (optional)

When `page`/`limit` are provided, the endpoint returns a paginated response shape:

```json
{
  "items": [ ... ],
  "page": 1,
  "limit": 10,
  "total": 42
}
```

When `page`/`limit` are not provided, the response remains the existing array of todos (backward compatible).

POST /api/v1/todos

Creates a new todo.

PUT /api/v1/todos/:id


Updates a todo.

PATCH /api/v1/todos/:id/complete

Marks a todo as complete.

DELETE /api/v1/todos/:id


Deletes a todo.
