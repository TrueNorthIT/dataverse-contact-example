import { useAuth0 } from "@auth0/auth0-react";
import { useState, useCallback } from "react";
import WhoAmI from "./components/WhoAmI";
import CaseList from "./components/CaseList";
import CreateCase from "./components/CreateCase";
import SchemaExplorer from "./components/SchemaExplorer";

export default function App() {
  const { isAuthenticated, isLoading, loginWithRedirect, logout, user } =
    useAuth0();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = useCallback(
    () => setRefreshKey((k) => k + 1),
    []
  );

  if (isLoading) {
    return (
      <div className="container">
        <div className="card loading">Initialising Auth0...</div>
      </div>
    );
  }

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

      <WhoAmI />
      <CaseList key={refreshKey} />
      <CreateCase onCreated={handleCreated} />
      <SchemaExplorer />
    </div>
  );
}
