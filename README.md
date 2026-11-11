# Study Mate

A study companion application to help you manage and organize your study sessions effectively.

## Team Members

- Mario Brino (@mariohbrino)
- Joseph Budu Larbi (@budujoseph)
- Armando Martin Fernandez Jara (@Charmando000)
- Israel Essien (@israelessien48-art)

## Prerequisites

- Node.js (version 20.9 or later)
- npm

## Set up

```bash
npm install
```

## Development

To start the development server, run:

```bash
npm run dev
```

Code style, formatting, and type checking:

```bash
npm run lint
npm run format
npm run typecheck
```

## Docker

Before proceeding, ensure that Docker is installed and running on your system. Install
docker on your system, see the [official docs](https://www.docker.com/products/docker-desktop/),
and then set up the local database using docker compose:

```bash
docker compose up -d
```

To stop and remove the local database container, run:

```bash
docker compose down
```

> [!NOTE]
> To remove the volume use tag `-v` with the `docker compose down` command.
> This will remove the associated volumes along with the container, ensuring a clean
> state for the database.

## Migrate

To apply database migrations using the local database container, run:

```bash
npm run db:migrate
```
