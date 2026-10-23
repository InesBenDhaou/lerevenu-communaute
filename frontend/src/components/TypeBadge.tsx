import type { DiscussionType } from "@/lib/types";

export function TypeBadge({ type }: { type: DiscussionType }) {
  return type === "question" ? (
    <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand-text">
      Question
    </span>
  ) : (
    <span className="rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-ink-2">
      Discussion
    </span>
  );
}
