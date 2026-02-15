import { useEffect, useState } from "react";
import { useDataverse } from "../useDataverse";

interface Case {
  incidentid: string;
  title: string;
  ticketnumber: string;
  statuscode: number;
  createdon: string;
}

export default function CaseList() {
  const client = useDataverse();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
                <td>{new Date(c.createdon).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
