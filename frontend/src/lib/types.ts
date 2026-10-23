
export type DiscussionType = "question" | "discussion";

export interface Author {
  id: string;
  username: string;
}

export interface CategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface Category extends CategoryRef {
  description: string;
  discussionsCount: number;
}

export interface DiscussionSummary {
  id: string;
  title: string;
  slug: string;
  type: DiscussionType;
  excerpt: string;
  createdAt: string;
  author: Author | null;
  category: CategoryRef | null;
  repliesCount: number;
}

export interface Reply {
  id: string;
  content: string;
  createdAt: string;
  author: Author | null;
}

export interface DiscussionDetail extends Omit<DiscussionSummary, "excerpt" | "repliesCount"> {
  content: string;
  replies: Reply[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { pagination: Pagination };
}

export type SortOrder = "createdAt:desc" | "createdAt:asc";

export interface ListParams {
  page?: number;
  pageSize?: number;
  sort?: SortOrder;
  category?: string;
  q?: string;
}

export interface CurrentUser {
  id: number;
  documentId: string;
  username: string;
  email: string;
}

/** Erreurs de validation par champ, ex. { title: "Le titre doit…" }. */
export type FieldErrors = Partial<Record<string, string>>;
