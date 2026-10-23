import { errors } from '@strapi/utils';

const { ValidationError } = errors;

export const DISCUSSION_TYPES = ['question', 'discussion'] as const;
export type DiscussionType = (typeof DISCUSSION_TYPES)[number];

export const LIMITS = {
  titleMin: 10,
  titleMax: 200,
  contentMax: 10000,
  replyMin: 2,
  replyMax: 5000,
  pageSizeDefault: 10,
  pageSizeMax: 50,
} as const;

type Issue = { path: string[]; message: string };

/**
 * Lève une ValidationError (HTTP 400) au format natif de Strapi :
 * { error: { status: 400, name: 'ValidationError', details: { errors: [{ path, message }] } } }
 * Le frontend peut ainsi afficher les erreurs champ par champ.
 */
export function throwIssues(issues: Issue[]): never {
  throw new ValidationError('Données invalides', {
    errors: issues.map((issue) => ({ ...issue, name: 'ValidationError' })),
  });
}

const asString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

export function parseDiscussionInput(raw: unknown) {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const title = asString(data.title);
  const content = asString(data.content);
  const category = asString(data.category);
  const type = asString(data.type) as DiscussionType;
  const issues: Issue[] = [];

  if (title.length < LIMITS.titleMin) {
    issues.push({
      path: ['title'],
      message: `Le titre doit contenir au moins ${LIMITS.titleMin} caractères.`,
    });
  } else if (title.length > LIMITS.titleMax) {
    issues.push({
      path: ['title'],
      message: `Le titre ne doit pas dépasser ${LIMITS.titleMax} caractères.`,
    });
  }
  if (!content) {
    issues.push({ path: ['content'], message: 'Le contenu est obligatoire.' });
  } else if (content.length > LIMITS.contentMax) {
    issues.push({
      path: ['content'],
      message: `Le contenu ne doit pas dépasser ${LIMITS.contentMax} caractères.`,
    });
  }
  if (!category) {
    issues.push({ path: ['category'], message: 'Choisissez une catégorie.' });
  }
  if (!DISCUSSION_TYPES.includes(type)) {
    issues.push({ path: ['type'], message: 'Le type doit être "question" ou "discussion".' });
  }
  if (issues.length) throwIssues(issues);

  return { title, content, category, type };
}

export function parseReplyInput(raw: unknown) {
  const data = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const content = asString(data.content);
  const discussion = asString(data.discussion);
  const issues: Issue[] = [];

  if (content.length < LIMITS.replyMin) {
    issues.push({ path: ['content'], message: 'La réponse ne peut pas être vide.' });
  } else if (content.length > LIMITS.replyMax) {
    issues.push({
      path: ['content'],
      message: `La réponse ne doit pas dépasser ${LIMITS.replyMax} caractères.`,
    });
  }
  if (!discussion) {
    issues.push({ path: ['discussion'], message: 'La discussion est obligatoire.' });
  }
  if (issues.length) throwIssues(issues);

  return { content, discussion };
}

/** Paramètres de liste whitelistés : on ne fait jamais confiance au query string brut. */
export function parseListQuery(query: Record<string, unknown>) {
  const toInt = (value: unknown, fallback: number) => {
    const n = Number.parseInt(String(value ?? ''), 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };

  const sort = query.sort ?? 'createdAt:desc';
  if (sort !== 'createdAt:desc' && sort !== 'createdAt:asc') {
    throwIssues([{ path: ['sort'], message: 'Tri invalide : createdAt:desc ou createdAt:asc.' }]);
  }

  const category = asString(query.category);
  if (category && !/^[a-z0-9-_.~]+$/i.test(category)) {
    throwIssues([{ path: ['category'], message: 'Catégorie invalide.' }]);
  }

  return {
    page: toInt(query.page, 1),
    pageSize: Math.min(toInt(query.pageSize, LIMITS.pageSizeDefault), LIMITS.pageSizeMax),
    sort: (sort as string).endsWith('asc') ? ('asc' as const) : ('desc' as const),
    category: category || undefined,
    q: asString(query.q).slice(0, 100) || undefined,
  };
}
