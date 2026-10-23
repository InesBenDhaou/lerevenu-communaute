"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center" role="alert">
      <p className="font-display text-2xl font-bold">Une erreur est survenue</p>
      <p className="mt-2 text-sm text-ink-3">
        {error.message.includes("indisponible")
          ? error.message
          : "Impossible de charger cette page pour le moment."}
      </p>
      <button
        onClick={reset}
        className="mt-5 rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
      >
        Réessayer
      </button>
    </div>
  );
}
