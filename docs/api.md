# API Reference

## Health

GET /health

Returns a simple status payload for service monitoring.

## Todos

GET /api/v1/todos

Returns the list of todos. Supports the following query parameters:

| Parameter   | Type    | Description                                              | Default |
|-------------|---------|----------------------------------------------------------|---------|
| `q`         | string  | Filter by title (case-insensitive substring match)       | —       |
| `completed` | boolean | Filter by completion state (`true` / `false`)            | —       |
| `status`    | string  | Filter by status (`OPEN`, `IN_PROGRESS`, `DONE`)         | —       |
| `page`      | number  | Page number for pagination                               | `1`     |
| `limit`     | number  | Items per page (max 100)                                 | `20`    |
| `sort`      | string  | Sort direction on `createdDate` (`asc` / `desc`)         | `desc`  |
| `meta`      | boolean | When `true`, returns `{ items, meta }` instead of array  | —       |

**Default response** (plain array, backward-compatible):
```json
[
  { "_id": "...", "title": "Buy milk", "status": "OPEN", ... }
]
```

**Response with `?meta=true`** (`{ items, meta }` envelope):
```json
{
  "items": [
    { "_id": "...", "title": "Buy milk", "status": "OPEN", ... }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

POST /api/v1/todos

Creates a new todo.

PUT /api/v1/todos/:id

Updates a todo.

PATCH /api/v1/todos/:id/complete

Marks a todo as complete.

DELETE /api/v1/todos/:id

Deletes a todo.
