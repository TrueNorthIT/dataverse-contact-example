import { useState, type FormEvent } from "react";
import { useDataverse } from "../useDataverse";

export default function CreateCase({ onCreated }: { onCreated?: () => void }) {
  const client = useDataverse();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    try {
      await client.me.create("case", { title, description });
      setTitle("");
      setDescription("");
      setStatus("done");
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setStatus("error");
    }
  }

  return (
    <div className="card">
      <h2>Create Case</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Cannot access dashboard"
            required
          />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            rows={3}
          />
        </label>
        <button type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Creating..." : "Create Case"}
        </button>
        {status === "done" && <p className="success">Case created!</p>}
        {status === "error" && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
