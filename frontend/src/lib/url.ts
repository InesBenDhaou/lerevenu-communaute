import type { SortOrder } from "./types";

export const DEFAULT_SORT: SortOrder = "createdAt:desc";

export function homeHref(params: { category?: string; sort?: SortOrder; q?: string; page?: number }) {
  const search = new URLSearchParams();
  if (params.category) search.set("category", params.category);
  if (params.sort && params.sort !== DEFAULT_SORT) search.set("sort", params.sort);
  if (params.q) search.set("q", params.q);
  if (params.page && params.page > 1) search.set("page", String(params.page));
  const query = search.toString();
  return query ? `/?${query}` : "/";
}

export function safeNext(value: string | null | undefined, fallback = "/") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  return value;
}

export const firstParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;
