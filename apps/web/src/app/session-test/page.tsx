
"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

export default function SessionTestPage() {
  const { user, isLoading, isAuthenticated, error, refetch } =
    useCurrentUser();

  return (
    <main className="mx-auto w-full max-w-xl space-y-5 p-8">
      <h1 className="text-3xl font-bold">Session Test</h1>

      {isLoading && <p>Checking your session…</p>}

      {!isLoading && error && (
        <section className="space-y-3">
          <p>Could not verify your session.</p>
          <p className="text-sm">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
          <button onClick={() => void refetch()}>
            Retry
          </button>
        </section>
      )}

      {!isLoading && !error && isAuthenticated && user && (
        <section className="space-y-2">
          <p>Authenticated</p>
          <p>Email: {user.email}</p>
          <p>User ID: {user.id}</p>
        </section>
      )}

      {!isLoading && !error && !isAuthenticated && (
        <p>No authenticated session found.</p>
      )}

      <button
        onClick={() => void refetch()}
        disabled={isLoading}
        className="rounded border px-4 py-2"
      >
        Check session again
      </button>
    </main>
  );
}
