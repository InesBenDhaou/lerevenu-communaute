/**
 * Sérialiseurs explicites (DTO) : seuls les champs listés ici sortent de l'API.
 * Cela garantit qu'aucune donnée sensible d'un utilisateur (email, rôle, etc.)
 * ne fuite jamais via une relation "author".
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

export const toAuthor = (user: any) =>
  user ? { id: user.documentId, username: user.username } : null;

export const toCategoryRef = (category: any) =>
  category ? { id: category.documentId, name: category.name, slug: category.slug } : null;

export const toReply = (reply: any) => ({
  id: reply.documentId,
  content: reply.content,
  createdAt: reply.createdAt,
  author: toAuthor(reply.author),
});

const excerpt = (text: string, max = 220) =>
  text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;

export const toDiscussionSummary = (d: any) => ({
  id: d.documentId,
  title: d.title,
  slug: d.slug,
  type: d.type,
  excerpt: excerpt(d.content ?? ''),
  createdAt: d.createdAt,
  author: toAuthor(d.author),
  category: toCategoryRef(d.category),
  repliesCount: d.replies?.count ?? 0,
});

export const toDiscussionDetail = (d: any) => ({
  id: d.documentId,
  title: d.title,
  slug: d.slug,
  type: d.type,
  content: d.content,
  createdAt: d.createdAt,
  author: toAuthor(d.author),
  category: toCategoryRef(d.category),
  replies: (d.replies ?? []).map(toReply),
});
