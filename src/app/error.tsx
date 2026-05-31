"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
      <p className="mt-3 text-sm text-slate-400">
        The page hit an unexpected error. Try refreshing, or return home and try
        again.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-500"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-surface-border px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
