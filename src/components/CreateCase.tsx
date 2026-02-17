/**
 * CreateCase — modal dialog to submit a new case to Dataverse.
 *
 * Demonstrates `client.me.create(table, fields)`.
 *
 * Opens as a modal overlay triggered by a button. After successful
 * creation, shows a confirmation message instead of immediately
 * refreshing the case list.
 */

import { useState, useEffect, type FormEvent } from "react";
import { useDataverse } from "../useDataverse";

interface CreateCaseProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateCase({ open, onClose, onCreated }: CreateCaseProps) {
  const client = useDataverse();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setSaving(false);
      setError(null);
      setSuccess(false);
    }
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const data = new FormData(e.currentTarget);
      await client.me.create("case", {
        title: data.get("title") as string,
        description: data.get("description") as string,
      });
      setSuccess(true);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSaving(false);
    }
  }

  function handleClose() {
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl">
        {success ? (
          <div className="text-center py-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
              <svg className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Case Created</h2>
            <p className="text-sm text-[var(--muted)] mb-6">
              Your case has been submitted successfully. We'll be in touch soon.
            </p>
            <button
              className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] transition-colors"
              onClick={handleClose}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[var(--accent-hover)]">Create Case</h2>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-transparent text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                onClick={handleClose}
                aria-label="Close"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
                Title
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Cannot access dashboard"
                  required
                  className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-medium text-[var(--muted)]">
                Description
                <textarea
                  name="description"
                  placeholder="Describe the issue..."
                  rows={3}
                  className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-y"
                />
              </label>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] hover:bg-[rgba(99,102,241,0.08)] transition-colors"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[var(--accent)] border border-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] hover:border-[var(--accent-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Creating..." : "Create Case"}
                </button>
              </div>
              {error && <p className="text-xs text-[var(--error)] mt-1">{error}</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
