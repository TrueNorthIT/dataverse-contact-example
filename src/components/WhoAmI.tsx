import { useEffect, useState } from "react";
import { useDataverse } from "../useDataverse";

interface Identity {
  email: string;
  fullname?: string;
  contactid: string;
}

export default function WhoAmI() {
  const client = useDataverse();
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client.me
      .whoami()
      .then((res) => setIdentity(res as Identity))
      .catch((err: Error) => setError(err.message));
  }, [client]);

  if (error) return <div className="card error">Error: {error}</div>;
  if (!identity) return <div className="card loading">Loading identity...</div>;

  return (
    <div className="card">
      <h2>Who Am I?</h2>
      <dl>
        <dt>Name</dt>
        <dd>{identity.fullname ?? "—"}</dd>
        <dt>Email</dt>
        <dd>{identity.email}</dd>
        <dt>Contact ID</dt>
        <dd>
          <code>{identity.contactid}</code>
        </dd>
      </dl>
      <details>
        <summary>Raw response</summary>
        <pre>{JSON.stringify(identity, null, 2)}</pre>
      </details>
    </div>
  );
}
