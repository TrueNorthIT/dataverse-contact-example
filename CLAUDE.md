# CLAUDE.md

Project guidelines and build notes for AI-assisted development.

## Project Overview

Minimal example app demonstrating how to use the [`@truenorth-it/dataverse-client`](https://www.npmjs.com/package/@truenorth-it/dataverse-client) SDK with Auth0. Designed to be opened in StackBlitz or run locally — shows how little code is needed to talk to Dataverse.

**API URL:** `https://api.dataverse-contact.tnapps.co.uk`

This is a **reference example**, not a production app. Keep it minimal and easy to follow.

## Build & Development

```bash
npm install          # Install dependencies
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # Type-check + Vite production build → dist/
npm run preview      # Preview the production build locally
```

No tests in this repo — it's a demo/example project.

Create a `.env` file from `.env.example` with Auth0 credentials before running.

## Architecture

Vite + React + TypeScript + Tailwind CSS v4. Auth via Auth0 PKCE (SPA flow). All data comes from the deployed Dataverse Contact API over HTTP.

### Key modules

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Main app — renders demo components |
| `src/useDataverse.ts` | Single hook wrapping `createClient` with Auth0 token |
| `src/dataverse-tables.generated.ts` | Generated TypeScript types from the API schema |
| `src/components/WhoAmI.tsx` | `client.me.whoami()` demo |
| `src/components/CaseList.tsx` | `client.me.list("case")` demo |
| `src/components/CreateCase.tsx` | `client.me.create("case", ...)` demo |
| `src/components/SchemaExplorer.tsx` | `client.schema()` demo |

### Design principles

- **One hook for everything**: `useDataverse()` creates the SDK client with Auth0 token injection
- **Each component = one SDK call**: demonstrates a single API operation
- **No shared code with the API repo**: everything comes from HTTP endpoints via the SDK
- **StackBlitz-friendly**: designed to work out of the box in browser IDEs

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_AUTH0_DOMAIN` | Yes | Auth0 tenant domain |
| `VITE_AUTH0_CLIENT_ID` | Yes | Auth0 SPA client ID |
| `VITE_AUTH0_AUDIENCE` | Yes | Auth0 API audience |
| `VITE_API_BASE_URL` | No | API base URL (defaults to `https://api.dataverse-contact.tnapps.co.uk`) |

## Regenerating Types

```bash
npx dataverse-client generate --url https://api.dataverse-contact.tnapps.co.uk
```

This overwrites `src/dataverse-tables.generated.ts` with current table interfaces and choice enums from the API schema endpoint.
