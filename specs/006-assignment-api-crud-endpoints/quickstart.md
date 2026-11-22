# Quickstart: Assignment API Reads and Server Actions

## 1. Prerequisites

Before running the feature, ensure you have:

- Node.js installed using the project's supported version.
- npm installed.
- The Study-Mate repository cloned locally.
- Project dependencies installed.
- PostgreSQL environment variables configured.
- The team's Clerk application and required authentication configuration available.

## 2. Install Dependencies

From the project root, run:

```bash
npm install
```

Verify the Clerk dependency and project authentication setup before implementing or testing authenticated operations.

## 3. Configure Environment Variables

Create or update the local `.env` file using the project's `.env.example` as a guide.

Configure the required PostgreSQL settings:

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_SSLMODE`

Configure Clerk environment variables using the team's approved setup instructions.

Never commit `.env` files or share secret keys in source code or public messages.

## 4. Start the Development Server

Run:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 5. Assignment GET API Endpoints

After implementation, the following read endpoints should be available:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/assignments` | List the authenticated student's assignments |
| GET | `/api/assignments/[id]` | Retrieve one assignment belonging to the authenticated student |

Both endpoints require a valid authenticated session.

The server must resolve the Clerk user to an existing Student record before retrieving assignment data.

## 6. Assignment Server Actions

Creating, updating, and deleting assignments must use Server Actions rather than POST, PATCH, or DELETE API endpoints.

| Operation | Server Action responsibility |
|---|---|
| Create | Validate input and create an assignment using `store()` |
| Update | Validate input and update an owned assignment using `update()` |
| Delete | Delete an owned assignment using `remove()` |

The actions must:

- Authenticate the current user.
- Resolve the user's Student database record.
- Use the Student database ID for ownership checks.
- Validate inputs using Zod.
- Return appropriate success or error results.
- Revalidate affected assignment data after successful mutations.

The client must never supply the authoritative Student ID.

## 7. Run Automated Tests

Run the project test suite:

```bash
npm run test
```

Run TypeScript checks:

```bash
npm run typecheck
```

Run lint checks:

```bash
npm run lint
```

Check formatting:

```bash
npm run format
```

## 8. Important Test Scenarios

Verify that:

1. An authenticated student can retrieve their assignments.
2. A student can retrieve one of their own assignments.
3. An authenticated student can create an assignment through a Server Action.
4. A student can update their own assignment through a Server Action.
5. A student can delete their own assignment through a Server Action.
6. An unauthenticated user cannot access assignment data or perform mutations.
7. Invalid input receives appropriate validation feedback.
8. A student cannot access or modify another student's assignment.
9. A missing Student record does not allow assignment operations.
10. An invalid assignment UUID is rejected by the individual GET endpoint.
11. Unexpected server errors do not expose internal details.
12. Successful mutations refresh or revalidate affected assignment data.

## 9. Security Verification

For every assignment operation, the server must:

1. Verify the authenticated Clerk user.
2. Find the matching Student record using `findByClerkId()`.
3. Use that Student record's database ID for assignment operations.
4. Check assignment ownership for individual assignment retrieval, updates, and deletion.
5. Reject invalid input before database operations.
6. Avoid exposing private assignment data or internal error details.

The application must never rely on a Student ID supplied by the client.