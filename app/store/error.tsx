"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-semibold text-zinc-900">Something went wrong</h2>
      <p className="mt-2 text-sm text-zinc-600">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white"
      >
        Try again
      </button>
    </main>
  );
}
