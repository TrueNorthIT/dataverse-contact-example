/**
 * CaseList — fetch and display the current user's cases.
 *
 * Demonstrates `client.me.list<T>(table, options)`:
 *   - `select`  — pick only the columns you need (reduces payload)
 *   - `top`     — limit the number of rows returned (1–100)
 *   - `orderBy` — sort by any field; append `:desc` for descending
 *
 * Other handy options you can try (not shown here):
 *   - `filter`      — OData-style filter, e.g. "statuscode eq 1"
 *   - `skip`        — pagination offset
 *   - `created`     — quick date filter: "today", "7d", "thismonth"
 *   - `expand`      — include related lookups in the response
 *
 * See the full list of query options in the @truenorth-it/dataverse-client README.
 */

import { useEffect, useState } from "react";
import type { Case } from "../dataverse-tables.generated";
import { useDataverse } from "../useDataverse";

export default function CaseList() {
  const client = useDataverse();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch up to 10 cases for the logged-in contact, newest first.
    // The generic <Case> gives you autocomplete on `res.data`.
    client.me
      .list<Case>("case", {
        select: ["title", "ticketnumber", "statuscode", "createdon"],
        top: 10,
        orderBy: "createdon:desc",
      })
      .then((res) => setCases(res.data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [client]);

  if (error) return <div className="card error">Error: {error}</div>;
  if (loading) return <div className="card loading">Loading cases...</div>;

  return (
    <div className="card">
      <h2>My Cases</h2>
      {cases.length === 0 ? (
        <p className="empty">No cases found. Create one below!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Ticket #</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.incidentid}>
                <td>
                  <code>{c.ticketnumber}</code>
                </td>
                <td>{c.title}</td>
                <td>{c.statuscode}</td>
                <td>{c.createdon ? new Date(c.createdon).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
