/**
 * useDataverse — a one-liner hook that gives every component access
 * to the Dataverse client.
 *
 * This is the entire "glue" between your auth layer and the SDK.
 * `createClient` only needs two things:
 *   1. baseUrl  — the URL where your Dataverse API is deployed
 *   2. getToken — an async function that returns a Bearer token
 *
 * That's it.  No Microsoft SDK, no MSAL, no Azure AD config.
 * The client handles authorization headers, pagination, error
 * mapping, and JSON parsing for you.
 */

import { useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { createClient } from "@truenorth-it/dataverse-client";

// Your deployed API URL — set in .env (see .env.example).
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function useDataverse() {
  const { getAccessTokenSilently } = useAuth0();

  // useMemo ensures we create the client once and reuse it, avoiding
  // unnecessary re-creation on every render.
  const client = useMemo(
    () =>
      createClient({
        baseUrl,
        // getToken is called automatically before each API request.
        // Auth0's getAccessTokenSilently() returns a cached token or
        // silently refreshes it — the SDK never sees auth complexity.
        getToken: () => getAccessTokenSilently(),
      }),
    [getAccessTokenSilently]
  );

  return client;
}
