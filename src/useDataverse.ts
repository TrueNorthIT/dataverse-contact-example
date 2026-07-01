/**
 * useDataverse — a one-liner hook that gives every component access
 * to the Dataverse client.
 *
 * This is the entire "glue" between your auth layer and the SDK.
 * `createClient` only needs two things:
 *   1. baseUrl  — the URL where your Dataverse API is deployed
 *   2. getToken — an async function that returns a Bearer token
 *
 * That's it.  The SDK never sees MSAL or Entra config — it just calls
 * getToken() before each request.  The client handles authorization
 * headers, pagination, error mapping, and JSON parsing for you.
 */

import { useMemo } from "react";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { createClient } from "@truenorth-it/dataverse-client";
import { config } from "./env";

export function useDataverse() {
  const { instance, accounts } = useMsal();

  // useMemo ensures we create the client once and reuse it, avoiding
  // unnecessary re-creation on every render.
  const client = useMemo(
    () =>
      createClient({
        baseUrl: config.apiBaseUrl,
        // getToken is called automatically before each API request.
        // MSAL's acquireTokenSilent() returns a cached token or silently
        // refreshes it; if interaction is required (e.g. consent or an
        // expired session) we fall back to an interactive redirect.
        getToken: async () => {
          const account = instance.getActiveAccount() ?? accounts[0];
          if (!account) throw new Error("Not signed in");
          try {
            const result = await instance.acquireTokenSilent({
              scopes: [config.entra.apiScope],
              account,
            });
            return result.accessToken;
          } catch (err) {
            if (err instanceof InteractionRequiredAuthError) {
              await instance.acquireTokenRedirect({
                scopes: [config.entra.apiScope],
                account,
              });
            }
            throw err;
          }
        },
      }),
    [instance, accounts]
  );

  return client;
}
