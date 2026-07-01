/**
 * Application entry point.
 *
 * The only setup the Dataverse client needs from your auth layer is a
 * function that returns a Bearer token.  Here we use Microsoft Entra
 * External ID (via MSAL), but any OAuth 2.0 / OIDC provider works —
 * just swap out the provider and pass your own `getToken` function in
 * useDataverse.ts.
 *
 * Environment variables are loaded by Vite at build time from a .env
 * file (see .env.example).  The VITE_ prefix makes them available to
 * client-side code via `import.meta.env`.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import {
  EventType,
  PublicClientApplication,
  type AuthenticationResult,
} from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";
import { config } from "./env";
import "./styles.css";

// MSAL public client — configured from your .env values.  For Entra
// External ID (CIAM) tenants the authority uses the ciamlogin.com host.
const pca = new PublicClientApplication({
  auth: {
    clientId: config.entra.clientId,
    authority: `https://${config.entra.tenantId}.ciamlogin.com/${config.entra.tenantId}`,
    knownAuthorities: [`${config.entra.tenantId}.ciamlogin.com`],
    redirectUri: config.entra.redirectUri,
    postLogoutRedirectUri: config.entra.redirectUri,
  },
  cache: { cacheLocation: "sessionStorage" },
});

// MSAL doesn't auto-set an active account on login — without this,
// acquireTokenSilent fails after the redirect completes.
pca.addEventCallback((event) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const account = (event.payload as AuthenticationResult).account;
    if (account) pca.setActiveAccount(account);
  }
});

async function bootstrap() {
  await pca.initialize();
  await pca.handleRedirectPromise();
  if (!pca.getActiveAccount()) {
    const [first] = pca.getAllAccounts();
    if (first) pca.setActiveAccount(first);
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      {/* MsalProvider makes useMsal() available throughout the app.
          The API scope (VITE_ENTRA_API_SCOPE) tells Entra which API the
          token is for, so the JWT is accepted by your Dataverse API. */}
      <MsalProvider instance={pca}>
        <App />
      </MsalProvider>
    </React.StrictMode>
  );
}

void bootstrap();
