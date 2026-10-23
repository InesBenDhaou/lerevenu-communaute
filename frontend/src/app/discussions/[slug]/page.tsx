import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { ReplyForm } from "@/components/ReplyForm";
import { ReplyList } from "@/components/ReplyList";
import { TypeBadge } from "@/components/TypeBadge";
import { categoryColor } from "@/lib/categoryColors";
import { formatDateTime } from "@/lib/format";
import { getCurrentUser } from "@/lib/session";
import { strapi } from "@/lib/strapi";

const getDiscussion = cache((slug: string) => strapi.getDiscussionBySlug(slug));

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const discussion = await getDiscussion(slug);
  return { title: discussion?.title ?? "Discussion introuvable" };
}

export default async function DiscussionPage({ params }: Props) {
  const { slug } = await params;
  const [discussion, user] = await Promise.all([getDiscussion(slug), getCurrentUser()]);
  if (!discussion) notFound();

  return (
    <main className="mx-auto max-w-3xl space-y-8">
      <nav aria-label="Fil d'Ariane" className="text-sm text-ink-3">
        <Link href="/" className="hover:text-ink">Accueil</Link>
        {discussion.category && (
          <>
            <span aria-hidden className="mx-2">›</span>
            <Link href={`/?category=${discussion.category.slug}`} className="hover:text-ink">
              {discussion.category.name}
            </Link>
          </>
        )}
      </nav>

      <article className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
          <TypeBadge type={discussion.type} />
          {discussion.category && (
            <span className="flex items-center gap-1.5 font-medium text-ink-2">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full"
                style={{ background: categoryColor(discussion.category.slug) }}
              />
              {discussion.category.name}
            </span>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight">{discussion.title}</h1>

        <div className="mt-4 flex items-center gap-2.5 text-sm">
          <Avatar name={discussion.author?.username ?? "?"} size={32} />
          <div>
            <p className="font-semibold">{discussion.author?.username ?? "Utilisateur supprimé"}</p>
            <time dateTime={discussion.createdAt} className="text-ink-3">
              {formatDateTime(discussion.createdAt)}
            </time>
          </div>
        </div>

        <p className="mt-5 whitespace-pre-wrap break-words text-[16px] leading-relaxed text-ink-2">
          {discussion.content}
        </p>
      </article>

      <ReplyList replies={discussion.replies} />

      {user ? (
        <ReplyForm discussionId={discussion.id} slug={discussion.slug} />
      ) : (
        <div className="rounded-2xl border border-dashed border-line-strong bg-surface p-6 text-center">
          <p className="font-semibold">Connectez-vous pour répondre</p>
          <Link
            href={`/login?next=/discussions/${discussion.slug}`}
            className="mt-3 inline-block rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Se connecter
          </Link>
        </div>
      )}
    </main>
  );
}
