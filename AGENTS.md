<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project Governance

This project follows the constitution at `.specify/memory/constitution.md`. Read it
before making code changes — it defines non-negotiable rules for TypeScript (strict, no
`any`), Tailwind (utility-first, no custom CSS), Next.js patterns (server components by
default), testing, naming, and collaboration.

## Spec Kit

Feature work follows the Spec Kit workflow (`/speckit.constitution` → `/speckit.specify`
→ `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`):

- Command definitions: `.github/skills/speckit-*/SKILL.md`
- Templates, scripts, and memory: `.specify/`
- Generated feature specs live under `specs/<NNN-feature-name>/`
