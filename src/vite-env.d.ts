/// <reference types="vite/client" />

/**
 * Type-safe environment variables.
 *
 * Vite exposes any variable prefixed with VITE_ on `import.meta.env`.
 * Declaring them here gives you autocomplete and compile-time checks
 * so you'll catch typos before they hit the browser.
 *
 * Copy .env.example to .env and fill in the values for your Auth0
 * tenant and deployed API URL.
 */
interface ImportMetaEnv {
  /** Auth0 tenant domain, e.g. "my-tenant.auth0.com" */
  readonly VITE_AUTH0_DOMAIN: string;
  /** Auth0 SPA application client ID */
  readonly VITE_AUTH0_CLIENT_ID: string;
  /** API audience identifier — must match the API registered in Auth0 */
  readonly VITE_AUTH0_AUDIENCE: string;
  /** Base URL of your deployed Dataverse API, e.g. "https://your-api.vercel.app" */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
