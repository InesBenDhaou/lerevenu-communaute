import "server-only";
import type {
  Category,
  CurrentUser,
  DiscussionDetail,
  DiscussionType,
  ListParams,
  Paginated,
  DiscussionSummary,
  Reply,
  FieldErrors,
} from "./types";

const STRAPI_URL = process.env.STRAPI_URL ?? "http://localhost:1337";

export class StrapiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fieldErrors: FieldErrors = {},
  ) {
    super(message);
    this.name = "StrapiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST";
  token?: string;
  body?: unknown;
  /** Stratégie de cache Next.js pour les GET. */
  next?: { revalidate?: number | false; tags?: string[] };
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", token, body, next } = options;

  let response: Response;
  try {
    response = await fetch(`${STRAPI_URL}/api${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // Par défaut : jamais de cache pour les données qui changent (discussions, réponses).
      ...(next ? { next } : { cache: "no-store" as const }),
    });
  } catch {
    throw new StrapiError(503, "Le service est momentanément indisponible. Réessayez dans un instant.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const fieldErrors: FieldErrors = {};
    for (const issue of payload?.error?.details?.errors ?? []) {
      const key = Array.isArray(issue.path) ? issue.path[0] : undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new StrapiError(
      response.status,
      payload?.error?.message ?? `Erreur ${response.status}`,
      fieldErrors,
    );
  }

  return (await response.json()) as T;
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const strapi = {
  /** Catégories : changent rarement -> cache 60 s (revalidation en arrière-plan). */
  async getCategories(): Promise<Category[]> {
    const res = await request<{ data: Category[] }>("/categories", {
      next: { revalidate: 60, tags: ["categories"] },
    });
    return res.data;
  },

  async getDiscussions(params: ListParams = {}): Promise<Paginated<DiscussionSummary>> {
    return request<Paginated<DiscussionSummary>>(`/discussions${toQuery({ ...params })}`);
  },

  /** Retourne null si la discussion n'existe pas (-> notFound() côté page). */
  async getDiscussionBySlug(slug: string): Promise<DiscussionDetail | null> {
    try {
      const res = await request<{ data: DiscussionDetail }>(
        `/discussions/slug/${encodeURIComponent(slug)}`,
      );
      return res.data;
    } catch (error) {
      if (error instanceof StrapiError && error.status === 404) return null;
      throw error;
    }
  },

  async createDiscussion(
    token: string,
    data: { title: string; content: string; type: DiscussionType; category: string },
  ): Promise<DiscussionDetail> {
    const res = await request<{ data: DiscussionDetail }>("/discussions", {
      method: "POST",
      token,
      body: { data },
    });
    return res.data;
  },

  async createReply(token: string, data: { content: string; discussion: string }): Promise<Reply> {
    const res = await request<{ data: Reply }>("/replies", { method: "POST", token, body: { data } });
    return res.data;
  },

  async login(identifier: string, password: string): Promise<{ jwt: string; user: CurrentUser }> {
    return request("/auth/local", { method: "POST", body: { identifier, password } });
  },

  async getMe(token: string): Promise<CurrentUser | null> {
    try {
      return await request<CurrentUser>("/users/me", { token });
    } catch (error) {
      // Token expiré/invalide : on considère simplement l'utilisateur comme déconnecté.
      if (error instanceof StrapiError && [401, 403].includes(error.status)) return null;
      throw error;
    }
  },
};
