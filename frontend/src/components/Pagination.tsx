import Link from "next/link";
import { homeHref } from "@/lib/url";
import type { Pagination as PaginationMeta, SortOrder } from "@/lib/types";

export function Pagination({
  pagination,
  category,
  sort,
  q,
}: {
  pagination: PaginationMeta;
  category?: string;
  sort: SortOrder;
  q?: string;
}) {
  const { page, pageCount } = pagination;
  if (pageCount <= 1) return null;

  const link = "rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-2";
  const disabled = "pointer-events-none rounded-full border border-line px-4 py-2 text-sm text-ink-3 opacity-50";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between pt-2">
      {page > 1 ? (
        <Link href={homeHref({ category, sort, q, page: page - 1 })} className={link} rel="prev">
          ← Précédent
        </Link>
      ) : (
        <span className={disabled}>← Précédent</span>
      )}
      <span className="text-sm text-ink-3">
        Page {page} sur {pageCount}
      </span>
      {page < pageCount ? (
        <Link href={homeHref({ category, sort, q, page: page + 1 })} className={link} rel="next">
          Suivant →
        </Link>
      ) : (
        <span className={disabled}>Suivant →</span>
      )}
    </nav>
  );
}
