/**
 * SchemaExplorer — browse your API's table metadata at runtime.
 *
 * `client.schema()` returns every table the API exposes, along with
 * its fields, types, and labels.  This is useful for:
 *   - Understanding what data is available without reading docs
 *   - Building dynamic UIs that adapt to the schema
 *   - Debugging field names and types
 *
 * You can also fetch schema for a single table:
 *   const caseSchema = await client.schema("case");
 *
 * Tip: If you want to generate TypeScript interfaces from this schema
 * at build time (instead of browsing it at runtime), use the CLI:
 *
 *   npx dataverse-client generate --url https://your-api.vercel.app
 *
 * This creates a typed .generated.ts file with interfaces for every
 * table and const enums for every choice field.  See the README for
 * more details on schema generation.
 */

import { useEffect, useState } from "react";
import type { TableSchema } from "@truenorth-it/dataverse-client";
import { useDataverse } from "../useDataverse";

export default function SchemaExplorer() {
  const client = useDataverse();
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the full schema — returns an array of every table the
    // API exposes along with field metadata.
    client
      .schema()
      .then((res) => {
        const list = Array.isArray(res) ? res : [res];
        setTables(list);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [client]);

  if (error) return <div className="card error">Error: {error}</div>;
  if (loading) return <div className="card loading">Loading schema...</div>;

  const active = tables.find((t) => t.name === selected);

  return (
    <div className="card">
      <h2>Schema Explorer</h2>
      {/* Click a table name to expand its field list */}
      <div className="chip-row">
        {tables.map((t) => (
          <button
            key={t.name}
            className={`chip ${selected === t.name ? "active" : ""}`}
            onClick={() => setSelected(t.name === selected ? null : t.name)}
          >
            {t.name}
          </button>
        ))}
      </div>
      {active && (
        <div className="schema-detail">
          <p>
            <strong>Endpoint:</strong> <code>{active.endpoint}</code>
          </p>
          <p>
            <strong>Permission:</strong> <code>{active.permission}</code>
          </p>
          <p>
            <strong>Primary key:</strong> <code>{active.primaryKey}</code>
          </p>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {active.fields.map((f) => (
                <tr key={f.name}>
                  <td>
                    <code>{f.name}</code>
                  </td>
                  <td>{f.type}</td>
                  <td>{f.description ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
