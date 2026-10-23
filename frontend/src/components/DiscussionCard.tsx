import Link from "next/link";
import { Avatar } from "./Avatar";
import { TypeBadge } from "./TypeBadge";
import { categoryColor } from "@/lib/categoryColors";
import { formatDate, pluralize, timeAgo } from "@/lib/format";
import type { DiscussionSummary } from "@/lib/types";

export function DiscussionCard({ discussion }: { discussion: DiscussionSummary }) {
  const { title, slug, type, excerpt, author, category, repliesCount, createdAt } = discussion;

  return (
    <article className="rounded-2xl border border-line bg-surface p-4 transition hover:border-line-strong hover:shadow-sm sm:p-5">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
        <TypeBadge type={type} />
        {category && (
          <Link
            href={`/?category=${category.slug}`}
            className="flex items-center gap-1.5 font-medium text-ink-2 hover:text-brand-text"
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full"
              style={{ background: categoryColor(category.slug) }}
            />
            {category.name}
          </Link>
        )}
      </div>

      <h2 className="font-display text-xl font-bold leading-snug">
        <Link href={`/discussions/${slug}`} className="hover:text-brand-text">
          {title}
        </Link>
      </h2>
      <p className="mt-1.5 line-clamp-2 text-sm text-ink-2">{excerpt}</p>

      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-3">
        <span className="flex items-center gap-2">
          <Avatar name={author?.username ?? "?"} size={24} />
          <span className="font-medium text-ink-2">{author?.username ?? "Utilisateur supprimé"}</span>
          <span aria-hidden>·</span>
          <time dateTime={createdAt} title={formatDate(createdAt)}>
            {timeAgo(createdAt)}
          </time>
        </span>
        <Link
          href={`/discussions/${slug}#reponses`}
          className="rounded-full bg-surface-2 px-3 py-1 font-medium text-ink-2 hover:bg-line"
          aria-label={pluralize(repliesCount, "réponse", "réponses")}
        >
          💬 {pluralize(repliesCount, "réponse", "réponses")}
        </Link>
      </footer>
    </article>
  );
}
