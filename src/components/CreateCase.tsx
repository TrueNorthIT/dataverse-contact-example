import { useState, type FormEvent } from "react";
import { useDataverse } from "../useDataverse";

export default function CreateCase({ onCreated }: { onCreated?: () => void }) {
  const client = useDataverse();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData(e.currentTarget);
      await client.me.create("case", {
        title: data.get("title") as string,
        description: data.get("description") as string,
      });
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  return (
    <div className="card">
      <h2>Create Case</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            name="title"
            type="text"
            placeholder="e.g. Cannot access dashboard"
            required
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            placeholder="Describe the issue..."
            rows={3}
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create Case"}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
