import { randomBytes } from 'node:crypto';

/** "Faut-il investir en ETF ?" -> "faut-il-investir-en-etf" */
export function slugify(input: string): string {
  const slug = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
  return slug || 'discussion';
}

/** Slug lisible + suffixe aléatoire : URL propre et unicité quasi garantie. */
export function uniqueSlug(title: string): string {
  return `${slugify(title)}-${randomBytes(3).toString('hex')}`;
}
