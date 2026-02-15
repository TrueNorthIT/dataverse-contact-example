# Dataverse Contact API — Example

A tiny React + TypeScript demo showing how to use [`@truenorth-it/dataverse-client`](https://www.npmjs.com/package/@truenorth-it/dataverse-client) with Auth0.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/TrueNorthIT/dataverse-contact-example)

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

## SDK at a glance

```typescript
import { createClient } from "@truenorth-it/dataverse-client";

const client = createClient({
  baseUrl: "https://your-api.vercel.app",
  getToken: () => auth0.getAccessTokenSilently(),
});

// Identity
const me = await client.me.whoami();

// List records
const cases = await client.me.list("case", {
  select: ["title", "statuscode"],
  top: 20,
  orderBy: "createdon:desc",
});

// Create a record
await client.me.create("case", { title: "New case" });

// Search
const results = await client.me.lookup("case", { search: "urgent" });

// Schema & choices (no auth required)
const schema = await client.schema("case");
const choices = await client.choices("case", "statuscode");
```
