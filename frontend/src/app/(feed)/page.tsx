import Link from "next/link";
import { CategoryNav } from "@/components/CategoryNav";
import { DiscussionList } from "@/components/DiscussionList";
import { Pagination } from "@/components/Pagination";
import { Toolbar } from "@/components/Toolbar";
import { strapi } from "@/lib/strapi";
import { getCurrentUser } from "@/lib/session";
import { DEFAULT_SORT, firstParam } from "@/lib/url";
import type { SortOrder } from "@/lib/types";

const PAGE_SIZE = 8;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = firstParam(params.category) || undefined;
  const q = firstParam(params.q)?.trim() || undefined;
  const sort: SortOrder = firstParam(params.sort) === "createdAt:asc" ? "createdAt:asc" : DEFAULT_SORT;
  const page = Math.max(1, Number.parseInt(firstParam(params.page) ?? "1", 10) || 1);

  const [categories, { data: discussions, meta }, user] = await Promise.all([
    strapi.getCategories(),
    strapi.getDiscussions({ category, sort, q, page, pageSize: PAGE_SIZE }),
    getCurrentUser(),
  ]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside>
        <CategoryNav categories={categories} active={category} sort={sort} />
      </aside>

      <main className="min-w-0 space-y-5">
        {!user && !category && !q && (
          <section className="rounded-2xl bg-[#1c1c1e] p-6 text-white sm:p-8">
            <h1 className="font-display text-3xl font-black leading-tight sm:text-4xl">
              La communauté des lecteurs du Revenu
            </h1>
            <p className="mt-3 max-w-2xl text-white/75">
              Posez vos questions d’argent, partagez vos expériences et échangez avec la rédaction.
              Bourse, épargne, impôts, retraite, transmission.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold hover:bg-brand-hover"
            >
              Rejoindre gratuitement
            </Link>
          </section>
        )}

        <header className="flex items-end justify-between gap-3">
          <div>
            <h1 className={`font-display text-2xl font-bold ${!user && !category && !q ? "sr-only" : ""}`}>
              {activeCategory ? activeCategory.name : q ? `Résultats pour « ${q} »` : "Discussions"}
            </h1>
            {activeCategory && <p className="mt-1 text-sm text-ink-3">{activeCategory.description}</p>}
          </div>
          <Link
            href={`/discussions/new${category ? `?category=${category}` : ""}`}
            className="shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold hover:bg-surface-2"
          >
            + Publier
          </Link>
        </header>

        <Toolbar category={category} sort={sort} q={q} />

        <p className="text-sm text-ink-3" aria-live="polite">
          {meta.pagination.total} discussion{meta.pagination.total > 1 ? "s" : ""}
        </p>

        <DiscussionList discussions={discussions} isFiltered={Boolean(category || q)} />
        <Pagination pagination={meta.pagination} category={category} sort={sort} q={q} />
      </main>
    </div>
  );
}
