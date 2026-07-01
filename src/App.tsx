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
 * Notice that none of these components import MSAL directly — they
 * all go through the shared useDataverse() hook, keeping auth concerns
 * in a single place.
 */

import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useState, useCallback } from "react";
import { accountToUser, config } from "./env";
import WhoAmI from "./components/WhoAmI";
import CaseList from "./components/CaseList";
import CreateCase from "./components/CreateCase";
import SchemaExplorer from "./components/SchemaExplorer";

export default function App() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = inProgress !== "none";
  const user = accountToUser(instance.getActiveAccount() ?? accounts[0]);

  // refreshKey forces CaseList to remount after a new case is created,
  // so the list is always up-to-date.
  const [refreshKey, setRefreshKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreated = useCallback(
    () => setRefreshKey((k) => k + 1),
    []
  );

  const handleCloseModal = useCallback(
    () => setModalOpen(false),
    []
  );

  const handleOpenModal = useCallback(
    () => setModalOpen(true),
    []
  );

  // --- Auth loading state ---
  if (isLoading) {
    return (
      <div className="container">
        <div className="card loading">Initialising Microsoft Entra External ID...</div>
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
            <code>@truenorth-it/dataverse-client</code> with React and
            Microsoft Entra External ID to interact with a Dataverse Contact
            API.
          </p>
          <button
            className="primary"
            onClick={() =>
              instance.loginRedirect({ scopes: [config.entra.apiScope] })
            }
          >
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
          <button onClick={() => instance.logoutRedirect()}>
            Log out
          </button>
        </div>
      </header>

      {/* Each component below demonstrates a single SDK capability.
          They are intentionally simple — the SDK does the heavy lifting. */}
      <WhoAmI />
      <CaseList key={refreshKey} onCreateClick={handleOpenModal} />
      <CreateCase
        open={modalOpen}
        onClose={handleCloseModal}
        onCreated={handleCreated}
      />
      <SchemaExplorer />
    </div>
  );
}
