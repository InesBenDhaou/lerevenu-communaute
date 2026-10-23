import type { DiscussionSummary } from "@/lib/types";

export const discussion = (overrides: Partial<DiscussionSummary> = {}): DiscussionSummary => ({
  id: "doc1",
  title: "PEA ou assurance-vie pour un ETF World ?",
  slug: "pea-ou-assurance-vie-demo",
  type: "question",
  excerpt: "Je débute et je souhaite investir 300 € par mois.",
  createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
  author: { id: "u1", username: "alice" },
  category: { id: "c1", name: "Bourse & actions", slug: "bourse" },
  repliesCount: 3,
  ...overrides,
});
