"use client";

import { useEffect } from "react";
import { Button } from "@/components/common/Button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="font-editorial text-3xl font-semibold">Something went wrong</h2>
      <p className="mt-3 max-w-md text-sm text-[var(--color-text-muted)]">
        {error?.message || "We encountered an unexpected error while loading this page."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()} size="md">
          Try again
        </Button>
      </div>
    </main>
  );
}

