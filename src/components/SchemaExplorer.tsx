import { useEffect, useState } from "react";
import { useDataverse } from "../useDataverse";

interface TableSchema {
  name: string;
  endpoint: string;
  permission: string;
  primaryKey: string;
  defaultFields: string[];
  fields: { name: string; type: string; label?: string }[];
}

export default function SchemaExplorer() {
  const client = useDataverse();
  const [tables, setTables] = useState<TableSchema[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client
      .schema()
      .then((res) => {
        const list = Array.isArray(res) ? res : [res];
        setTables(list as TableSchema[]);
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
                <th>Label</th>
              </tr>
            </thead>
            <tbody>
              {active.fields.map((f) => (
                <tr key={f.name}>
                  <td>
                    <code>{f.name}</code>
                  </td>
                  <td>{f.type}</td>
                  <td>{f.label ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
