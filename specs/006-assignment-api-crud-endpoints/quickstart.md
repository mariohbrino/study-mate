# Quickstart: Assignment API CRUD Endpoints

## 1. Prerequisites

Before running the feature, ensure you have:

- Node.js installed using the project's supported version.
- npm installed.
- The Study-Mate repository cloned locally.
- Project dependencies installed.
- PostgreSQL environment variables configured.
- The authentication provider and required credentials configured after team confirmation.

## 2. Install Dependencies

From the project root, run:

```bash
npm install
```

## 3. Configure Environment Variables

Create or update the local `.env` file using the project's `.env.example` as a guide.

Configure the required PostgreSQL settings:

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_SSLMODE`

Add authentication environment variables only after the team confirms the authentication provider and its setup instructions.

Never commit `.env` files or share secret keys in source code.

## 4. Start the Development Server

Run:

```bash
npm run dev
```

Open the local URL displayed in the terminal.

## 5. Assignment API Endpoints

After implementation, the following endpoints should be available:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/assignments` | List the authenticated student's assignments |
| POST | `/api/assignments` | Create an assignment |
| GET | `/api/assignments/{id}` | Retrieve one assignment |
| PATCH | `/api/assignments/{id}` | Update an assignment |
| DELETE | `/api/assignments/{id}` | Delete an assignment |

Every request must use a valid authenticated session.

## 6. Run Automated Tests

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

## 7. Important Test Scenarios

Verify that:

1. An authenticated student can create an assignment.
2. A student can retrieve their own assignments.
3. A student can update their own assignment.
4. A student can delete their own assignment.
5. An unauthenticated request receives `401 Unauthorized`.
6. Invalid request data receives `400 Bad Request`.
7. A student cannot access another student's assignment.
8. A missing student record does not allow assignment operations.
9. An invalid assignment UUID is rejected.
10. Unexpected server errors do not expose internal details.

## 8. Security Verification

For every request, the server must:

1. Verify the authenticated user.
2. Find the matching Student record.
3. Use that Student record's database ID for assignment operations.
4. Check assignment ownership when an individual assignment is requested or modified.

The API must never rely on a student ID supplied by the client.