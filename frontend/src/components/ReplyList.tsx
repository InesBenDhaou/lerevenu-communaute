import { Avatar } from "./Avatar";
import { formatDateTime, pluralize, timeAgo } from "@/lib/format";
import type { Reply } from "@/lib/types";

export function ReplyList({ replies }: { replies: Reply[] }) {
  return (
    <section id="reponses" aria-labelledby="reponses-title" className="scroll-mt-24">
      <h2 id="reponses-title" className="font-display text-2xl font-bold">
        {pluralize(replies.length, "réponse", "réponses")}
      </h2>

      {replies.length === 0 ? (
        <p className="mt-3 rounded-2xl border border-dashed border-line-strong bg-surface p-6 text-center text-sm text-ink-3">
          Aucune réponse pour le moment. Votre expérience peut aider !
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {replies.map((reply) => (
            <li key={reply.id} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
              <div className="mb-2 flex items-center gap-2 text-sm">
                <Avatar name={reply.author?.username ?? "?"} size={28} />
                <span className="font-semibold">{reply.author?.username ?? "Utilisateur supprimé"}</span>
                <span aria-hidden className="text-ink-3">·</span>
                <time dateTime={reply.createdAt} title={formatDateTime(reply.createdAt)} className="text-ink-3">
                  {timeAgo(reply.createdAt)}
                </time>
              </div>
              {/* React échappe le texte : pas de XSS. whitespace-pre-wrap conserve les retours à la ligne. */}
              <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink-2">
                {reply.content}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
