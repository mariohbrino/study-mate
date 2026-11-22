# Assignment API Contract

## 1. Base Path

All endpoints use:

`/api/assignments`

All responses use JSON unless the response has no body.

Authentication is required for every endpoint. The server must resolve the authenticated identity to an existing Student record before accessing assignments.

## 2. Assignment Response

A successful assignment response contains:

| Field | Type | Description |
|---|---|---|
| id | string (UUID) | Assignment identifier |
| title | string | Assignment title |
| description | string | Assignment description |
| course | string | Related course |
| dueAt | string (ISO 8601) | Due date and time |
| status | string | `pending`, `in_progress`, or `completed` |
| createdAt | string (ISO 8601) | Creation timestamp |
| updatedAt | string (ISO 8601) | Last update timestamp |

The response must not expose internal ownership information such as `studentId`.

## 3. List Assignments

**GET** `/api/assignments`

Returns assignments belonging to the authenticated student.

**Success: 200 OK**

```json
{
  "data": [
    {
      "id": "valid-assignment-uuid",
      "title": "Complete project",
      "description": "Finish the project work",
      "course": "WDD430",
      "dueAt": "2026-12-01T10:00:00.000Z",
      "status": "pending",
      "createdAt": "2026-11-21T10:00:00.000Z",
      "updatedAt": "2026-11-21T10:00:00.000Z"
    }
  ]
}
```

An empty assignment list returns `200 OK` with an empty `data` array.

## 4. Create Assignment

**POST** `/api/assignments`

Creates an assignment for the authenticated student.

**Request body:**

```json
{
  "title": "Complete project",
  "description": "Finish the project work",
  "course": "WDD430",
  "dueAt": "2026-12-01T10:00:00.000Z",
  "status": "pending"
}
```

The server supplies the owner ID. The client must not supply `studentId`.

**Success: 201 Created**

Returns the created assignment using the Assignment Response structure.

## 5. Get One Assignment

**GET** `/api/assignments/{id}`

Returns one assignment belonging to the authenticated student.

**Success: 200 OK**

Returns the assignment using the Assignment Response structure.

## 6. Update Assignment

**PATCH** `/api/assignments/{id}`

Updates permitted fields of an assignment belonging to the authenticated student.

**Request body example:**

```json
{
  "status": "completed"
}
```

Permitted fields:

- `title`
- `description`
- `course`
- `dueAt`
- `status`

At least one permitted field must be supplied. The client cannot change `id` or `studentId`.

**Success: 200 OK**

Returns the updated assignment using the Assignment Response structure.

## 7. Delete Assignment

**DELETE** `/api/assignments/{id}`

Deletes an assignment belonging to the authenticated student.

**Success: 204 No Content**

Returns no response body.

## 8. Error Responses

| HTTP status | Meaning |
|---|---|
| 400 Bad Request | Invalid JSON, invalid UUID, or validation failure |
| 401 Unauthorized | User is not authenticated |
| 404 Not Found | Student record or requested assignment is not found or accessible |
| 500 Internal Server Error | Unexpected server error |

**Error response example:**

```json
{
  "error": {
    "message": "Invalid assignment data"
  }
}
```

Error responses must not expose database details, secrets, or internal stack traces.

## 9. Security Requirements

- Every endpoint requires authentication.
- The server resolves the authenticated identity to a Student record.
- The API never trusts a client-provided `studentId`.
- Every individual assignment operation checks both assignment ID and student ID.
- Access to another student's assignment returns `404 Not Found`.
- User-specific responses must not be publicly cached.
- The authentication provider and its server-side integration must be confirmed by the team before implementation.