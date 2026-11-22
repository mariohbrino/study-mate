# Assignment API Contract

## 1. Base Path

All API endpoints use:

`/api/assignments`

All responses use JSON unless the response has no body.

Authentication is required for every endpoint. The server must resolve the authenticated Clerk identity to an existing Student record before accessing assignments.

**Architecture decision:**
- API Route Handlers are used for reading assignments.
- Server Actions are used for creating, updating, and deleting assignments.
- All operations reuse the existing Assignment model.

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

## 4. Get One Assignment

**GET** `/api/assignments/{id}`

Returns one assignment belonging to the authenticated student.

**Success: 200 OK**

Returns the assignment using the Assignment Response structure inside a `data` object.

```json
{
  "data": {
    "id": "valid-assignment-uuid",
    "title": "Complete project",
    "description": "Finish the project work",
    "course": "WDD430",
    "dueAt": "2026-12-01T10:00:00.000Z",
    "status": "pending",
    "createdAt": "2026-11-21T10:00:00.000Z",
    "updatedAt": "2026-11-21T10:00:00.000Z"
  }
}
```

The server must validate the UUID and verify ownership using the authenticated Student ID.

## 5. Assignment Mutations Through Server Actions

Creating, updating, and deleting assignments are not API endpoints.

They must be implemented as Server Actions in the agreed action module.

### Create Assignment

The create action accepts:
- `title`
- `description`
- `course`
- `dueAt`
- `status`

The action must:
- Validate input using the assignment creation Zod schema.
- Authenticate the current Clerk user.
- Resolve the corresponding Student record.
- Use the authenticated Student ID as the owner.
- Create the assignment using the existing Assignment model.
- Return a useful success or error result.

### Update Assignment

The update action accepts the assignment ID and permitted fields:
- `title`
- `description`
- `course`
- `dueAt`
- `status`

The action must:
- Validate input using the assignment update Zod schema.
- Require at least one permitted field.
- Prevent changes to `id` and `studentId`.
- Verify authentication and assignment ownership.
- Update the assignment using the existing Assignment model.
- Return a useful success or error result.

### Delete Assignment

The delete action accepts an assignment ID.

The action must:
- Verify authentication.
- Resolve the authenticated Student record.
- Verify assignment ownership.
- Delete the assignment using the existing Assignment model.
- Return a useful success or error result.

### Mutation Error Handling

- Update and delete actions must return a not-found result when the assignment does not exist or does not belong to the authenticated Student.
- Validation errors must identify the fields that need correction without exposing internal server details.
- All successful mutations must revalidate or refresh affected assignment data.

Server Actions return consistent, user-friendly validation and operation results. They do not use HTTP status codes as their client-facing result contract.

## 6. API Error Responses

| HTTP status | Meaning |
|---|---|
| 400 Bad Request | Invalid UUID or malformed request |
| 401 Unauthorized | User is not authenticated |
| 404 Not Found | Student record or requested assignment is not found or accessible |
| 500 Internal Server Error | Unexpected server error |

**Error response example:**

```json
{
  "error": {
    "message": "Invalid assignment ID"
  }
}
```

Error responses must not expose database details, secrets, or internal stack traces.

## 7. Security Requirements

- Every API handler and Server Action requires authentication.
- The server resolves the authenticated Clerk identity to a Student record.
- If the authenticated Clerk user has no matching Student record, assignment access is denied.
- The API and Server Actions never trust client-provided `studentId`.
- Every individual assignment operation checks both assignment ID and Student ID.
- Access to another student's assignment is treated as not found.
- User-specific API responses must not be publicly cached.
- Clerk authentication and the Clerk-to-Student mapping must be documented and tested.
- Database errors and stack traces must not be exposed to users.