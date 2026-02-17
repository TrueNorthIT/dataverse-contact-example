/**
 * Application entry point.
 *
 * The only setup the Dataverse client needs from your auth layer is a
 * function that returns a Bearer token.  Here we use Auth0, but any
 * OAuth 2.0 / OIDC provider works — just swap out the provider and
 * pass your own `getToken` function in useDataverse.ts.
 *
 * Environment variables are loaded by Vite at build time from a .env
 * file (see .env.example).  The VITE_ prefix makes them available to
 * client-side code via `import.meta.env`.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import "./styles.css";

// Auth0 tenant settings — fill these in via your .env file.
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Auth0Provider makes useAuth0() available throughout the app.
        The `audience` tells Auth0 which API the token is for, so the
        JWT will include the correct permissions for your Dataverse API. */}
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
