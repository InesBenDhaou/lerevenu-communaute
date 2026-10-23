import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface p-8 text-center">
      <p className="font-display text-2xl font-bold">Page introuvable</p>
      <p className="mt-2 text-sm text-ink-3">Cette discussion n’existe pas ou a été supprimée.</p>
      <Link
        href="/"
        className="mt-5 inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
      >
        Retour à la communauté
      </Link>
    </div>
  );
}
