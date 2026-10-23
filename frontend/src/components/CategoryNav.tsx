import Link from "next/link";
import { categoryColor } from "@/lib/categoryColors";
import { homeHref } from "@/lib/url";
import type { Category, SortOrder } from "@/lib/types";

/** Barre horizontale défilante sur mobile, colonne sticky sur desktop (comme la maquette). */
export function CategoryNav({
  categories,
  active,
  sort,
}: {
  categories: Category[];
  active?: string;
  sort?: SortOrder;
}) {
  const base = "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition";
  const on = "bg-brand-soft text-brand-text";
  const off = "text-ink-2 hover:bg-surface-2";

  return (
    <nav aria-label="Espaces de la communauté" className="lg:sticky lg:top-20">
      <p className="mb-2 hidden px-3 text-xs font-bold uppercase tracking-wide text-ink-3 lg:block">
        Espaces
      </p>
      <ul className="hide-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
        <li>
          <Link
            href={homeHref({ sort })}
            aria-current={!active ? "page" : undefined}
            className={`${base} ${!active ? on : off}`}
          >
            Toutes les discussions
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={homeHref({ category: category.slug, sort })}
              aria-current={active === category.slug ? "page" : undefined}
              className={`${base} justify-between ${active === category.slug ? on : off}`}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <span
                  aria-hidden
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: categoryColor(category.slug) }}
                />
                {category.name}
              </span>
              <span className="hidden text-xs text-ink-3 lg:inline">{category.discussionsCount}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
