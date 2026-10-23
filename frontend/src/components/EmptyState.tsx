import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-10 text-center">
      <p className="font-display text-xl font-bold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-3">{description}</p>
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="mt-5 inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
