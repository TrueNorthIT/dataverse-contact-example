/**
 * App — root component.
 *
 * Handles the authentication gate (login / loading) and renders four
 * demo components that each showcase a different SDK method:
 *
 *   WhoAmI         -> client.me.whoami()
 *   CaseList       -> client.me.list()
 *   CreateCase     -> client.me.create()
 *   SchemaExplorer -> client.schema()
 *
 * Notice that none of these components import Auth0 directly — they
 * all go through the shared useDataverse() hook, keeping auth concerns
 * in a single place.
 */

import { useAuth0 } from "@auth0/auth0-react";
import { useState, useCallback } from "react";
import WhoAmI from "./components/WhoAmI";
import CaseList from "./components/CaseList";
import CreateCase from "./components/CreateCase";
import SchemaExplorer from "./components/SchemaExplorer";

export default function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();

  // refreshKey forces CaseList and CreateCase to remount after a new
  // case is created, so the list is always up-to-date.
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = useCallback(
    () => setRefreshKey((k) => k + 1),
    []
  );

  // --- Auth loading state ---
  if (isLoading) {
    return (
      <div className="container">
        <div className="card loading">Initialising Auth0...</div>
      </div>
    );
  }

  // --- Not logged in ---
  if (!isAuthenticated) {
    return (
      <div className="container">
        <header>
          <h1>Dataverse Contact API</h1>
          <p className="subtitle">Interactive Example</p>
        </header>
        <div className="card hero">
          <p>
            This demo shows how to use{" "}
            <code>@truenorth-it/dataverse-client</code> with React and Auth0 to
            interact with a Dataverse Contact API.
          </p>
          <button className="primary" onClick={() => loginWithRedirect()}>
            Log in to get started
          </button>
        </div>
      </div>
    );
  }

  // --- Authenticated — render the demo components ---
  return (
    <div className="container">
      <header>
        <div>
          <h1>Dataverse Contact API</h1>
          <p className="subtitle">Interactive Example</p>
        </div>
        <div className="user-info">
          <span>{user?.email}</span>
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log out
          </button>
        </div>
      </header>

      {/* Each component below demonstrates a single SDK capability.
          They are intentionally simple — the SDK does the heavy lifting. */}
      <WhoAmI />
      <CaseList key={refreshKey} />
      <CreateCase key={refreshKey} onCreated={handleCreated} />
      <SchemaExplorer />
    </div>
  );
}
