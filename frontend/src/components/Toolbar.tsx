import Link from "next/link";
import { homeHref } from "@/lib/url";
import type { SortOrder } from "@/lib/types";

/** Recherche + tri : un simple formulaire GET et des liens, donc aucun JavaScript client nécessaire. */
export function Toolbar({ category, sort, q }: { category?: string; sort: SortOrder; q?: string }) {
  const options: { value: SortOrder; label: string }[] = [
    { value: "createdAt:desc", label: "Plus récentes" },
    { value: "createdAt:asc", label: "Plus anciennes" },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form action="/" method="get" role="search" className="flex flex-1 gap-2">
        {category && <input type="hidden" name="category" value={category} />}
        {sort !== "createdAt:desc" && <input type="hidden" name="sort" value={sort} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher une discussion…"
          aria-label="Rechercher une discussion"
          className="w-full rounded-full border border-line bg-surface px-4 py-2 text-sm outline-none focus:border-brand"
        />
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-2">
          Rechercher
        </button>
      </form>

      <div className="flex items-center gap-1 rounded-full bg-surface-2 p-1 text-sm" role="group" aria-label="Trier">
        {options.map((option) => (
          <Link
            key={option.value}
            href={homeHref({ category, sort: option.value, q })}
            aria-current={sort === option.value ? "true" : undefined}
            className={`rounded-full px-3 py-1 font-medium transition ${
              sort === option.value ? "bg-surface text-ink shadow-sm" : "text-ink-3 hover:text-ink"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
