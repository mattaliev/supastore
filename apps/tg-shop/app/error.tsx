"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
