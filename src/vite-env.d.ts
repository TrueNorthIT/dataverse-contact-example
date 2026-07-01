/// <reference types="vite/client" />

/**
 * Type-safe environment variables.
 *
 * Vite exposes any variable prefixed with VITE_ on `import.meta.env`.
 * Declaring them here gives you autocomplete and compile-time checks
 * so you'll catch typos before they hit the browser.
 *
 * Copy .env.example to .env and fill in the values for your Microsoft
 * Entra External ID tenant and deployed API URL.
 */
interface ImportMetaEnv {
  /** Entra External ID tenant ID (GUID) */
  readonly VITE_ENTRA_TENANT_ID: string;
  /** SPA application client ID */
  readonly VITE_ENTRA_CLIENT_ID: string;
  /** API access scope, e.g. "api://<api-app-id>/access_as_user" */
  readonly VITE_ENTRA_API_SCOPE: string;
  /** Base URL of your deployed Dataverse API (optional — has a default) */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
