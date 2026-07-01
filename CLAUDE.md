# CLAUDE.md

Project guidelines and build notes for AI-assisted development.

## Project Overview

Minimal example app demonstrating how to use the [`@truenorth-it/dataverse-client`](https://www.npmjs.com/package/@truenorth-it/dataverse-client) SDK with Microsoft Entra External ID. Designed to be opened in StackBlitz or run locally — shows how little code is needed to talk to Dataverse.

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

Create a `.env` file from `.env.example` with Microsoft Entra External ID credentials before running.

## Architecture

Vite + React + TypeScript + Tailwind CSS v4. Auth via Microsoft Entra External ID (MSAL PKCE in `@azure/msal-browser` + `@azure/msal-react`). All data comes from the deployed Dataverse Contact API over HTTP.

### Key modules

| Module | Purpose |
|--------|---------|
| `src/App.tsx` | Main app — renders demo components |
| `src/useDataverse.ts` | Single hook wrapping `createClient` with the MSAL token |
| `src/env.ts` | Environment variable validation + `accountToUser` helper |
| `src/dataverse-tables.generated.ts` | Generated TypeScript types from the API schema |
| `src/components/WhoAmI.tsx` | `client.me.whoami()` demo |
| `src/components/CaseList.tsx` | `client.me.list("case")` demo |
| `src/components/CreateCase.tsx` | `client.me.create("case", ...)` demo |
| `src/components/SchemaExplorer.tsx` | `client.schema()` demo |

### Design principles

- **One hook for everything**: `useDataverse()` creates the SDK client with MSAL token injection
- **Each component = one SDK call**: demonstrates a single API operation
- **No shared code with the API repo**: everything comes from HTTP endpoints via the SDK
- **StackBlitz-friendly**: designed to work out of the box in browser IDEs

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_ENTRA_TENANT_ID` | Yes | Entra External ID tenant ID (GUID) |
| `VITE_ENTRA_CLIENT_ID` | Yes | SPA application client ID |
| `VITE_ENTRA_API_SCOPE` | Yes | API access scope, e.g. `api://<api-app-id>/access_as_user` |
| `VITE_API_BASE_URL` | No | API base URL (defaults to `https://api.dataverse-contact.tnapps.co.uk`) |

## Regenerating Types

```bash
npx dataverse-client generate --url https://api.dataverse-contact.tnapps.co.uk
```

This overwrites `src/dataverse-tables.generated.ts` with current table interfaces and choice enums from the API schema endpoint.
