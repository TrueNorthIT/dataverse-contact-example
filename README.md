# Dataverse Contact API — Example

A tiny React + TypeScript demo showing how to use [`@truenorth-it/dataverse-client`](https://www.npmjs.com/package/@truenorth-it/dataverse-client) with Auth0.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/TrueNorthIT/dataverse-contact-example)

<!-- This project is designed to show how little code you need to talk to
     Dataverse.  The entire API layer is a single hook (useDataverse.ts)
     and each component is a single SDK call.  No OData, no MSAL, no
     Azure AD plumbing — just JSON in, JSON out. -->

## What's inside

| Component | What it does |
|-----------|-------------|
| `WhoAmI` | Calls `client.me.whoami()` and displays the authenticated user's identity |
| `CaseList` | Lists the user's cases with `client.me.list("case")` |
| `CreateCase` | Creates a new case with `client.me.create("case", { ... })` |
| `SchemaExplorer` | Browses table metadata with `client.schema()` |

All four components share a single `useDataverse()` hook that wraps `createClient` with the Auth0 token.

## Quick start

### 1. Open in StackBlitz (recommended)

Click the button above — StackBlitz will clone this repo, install deps, and start the dev server in your browser. Full TypeScript IntelliSense included.

### 2. Or run locally

```bash
git clone https://github.com/TrueNorthIT/dataverse-contact-example.git
cd dataverse-contact-example
cp .env.example .env
# Fill in your Auth0 + API values in .env
npm install
npm run dev
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_AUTH0_DOMAIN` | Your Auth0 tenant (e.g. `my-tenant.auth0.com`) |
| `VITE_AUTH0_CLIENT_ID` | Auth0 SPA application client ID |
| `VITE_AUTH0_AUDIENCE` | API audience (e.g. `https://dataverse-api`) |
| `VITE_API_BASE_URL` | Base URL of your deployed API (e.g. `https://your-api.vercel.app`) |

## Auth0 setup

For StackBlitz, add these to your Auth0 SPA application settings:

- **Allowed Callback URLs:** `https://*.stackblitz.io`
- **Allowed Logout URLs:** `https://*.stackblitz.io`
- **Allowed Web Origins:** `https://*.stackblitz.io`

## Generating TypeScript types from your schema

<!-- Instead of hand-writing interfaces for every Dataverse table, the
     SDK can pull the full schema from your API and generate a .ts file
     with typed interfaces and choice enums.  This means your editor
     gives you autocomplete for every field on every table. -->

The `@truenorth-it/dataverse-client` package includes a CLI that reads your API's schema endpoint and generates a TypeScript file with interfaces for every table and const enums for every choice (picklist) field.

### Basic usage

```bash
# Generate types from your deployed API
npx dataverse-client generate --url https://your-api.vercel.app
```

This creates `dataverse-tables.generated.ts` in the current directory containing typed interfaces for every table your API exposes.

### CLI options

| Flag | Default | Purpose |
|------|---------|---------|
| `--url`, `-u` | _(required)_ | Base URL of your API deployment |
| `--output`, `-o` | `./dataverse-tables.generated.ts` | Output file path |
| `--api-base` | `/api/v2` | API base path (if customised) |
| `--scope` | `default` | Scope segment in URLs |
| `--no-choices` | `false` | Skip choice/picklist value fetching |

### Example: custom output path

```bash
npx dataverse-client generate \
  --url https://your-api.vercel.app \
  --output ./src/types/dataverse.generated.ts
```

### Add it to your build

A common pattern is to regenerate types as a pre-build step so they stay in sync with your API:

```jsonc
// package.json
{
  "scripts": {
    "generate:types": "dataverse-client generate --url $API_URL",
    "prebuild": "npm run generate:types",
    "build": "tsc -b && vite build"
  }
}
```

### Programmatic usage

If you need more control, you can call the generator from code:

```typescript
import { generateTableTypes } from "@truenorth-it/dataverse-client";

// Fetch the schema from your API
const response = await fetch("https://your-api.vercel.app/api/v2/default/schema");
const schema = await response.json();

// Generate the TypeScript source
const tsSource = generateTableTypes(schema);

// Write it to disk (Node.js)
import { writeFileSync } from "fs";
writeFileSync("./src/types/dataverse.generated.ts", tsSource);
```

### What you get

The generated file includes:

- **Typed interfaces** for every table (e.g. `Case`, `Contact`, `CaseNotes`)
- **Const enums** for every choice/picklist field (e.g. `CaseStatusCode`)
- **Field name literals** so `select` arrays are type-checked

This means the `Case` interface in `CaseList.tsx` could be replaced with an import from the generated file — no more hand-writing field types.

## SDK at a glance

```typescript
import { createClient } from "@truenorth-it/dataverse-client";

// Two lines to create a fully-configured client.
// getToken is called automatically before every request.
const client = createClient({
  baseUrl: "https://your-api.vercel.app",
  getToken: () => auth0.getAccessTokenSilently(),
});

// Identity — "who is the logged-in user?"
const me = await client.me.whoami();

// List records — with select, sort, filter, pagination
const cases = await client.me.list("case", {
  select: ["title", "statuscode"],
  top: 20,
  orderBy: "createdon:desc",
});

// Create a record — just pass the table name and fields
await client.me.create("case", { title: "New case" });

// Update a record
await client.me.update("case", caseId, { description: "Updated" });

// Search across records
const results = await client.me.lookup("case", { search: "urgent" });

// Schema & choices (handy for building dynamic UIs)
const schema = await client.schema("case");
const choices = await client.choices("case", "statuscode");
```

### Query options reference

| Option | Type | Example |
|--------|------|---------|
| `select` | `string[]` | `["title", "statuscode"]` |
| `top` | `number` | `20` |
| `skip` | `number` | `40` |
| `orderBy` | `string` | `"createdon:desc"` |
| `filter` | `string \| string[]` | `"statuscode eq 1"` |
| `created` | `string` | `"today"`, `"7d"`, `"thismonth"` |
| `expand` | `string` | Related lookups |

See the full [`@truenorth-it/dataverse-client` README](https://www.npmjs.com/package/@truenorth-it/dataverse-client) for the complete API reference.
