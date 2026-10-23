import { factories } from '@strapi/strapi';
import { uniqueSlug } from '../../../utils/slug';
import { throwIssues } from '../../../utils/validation';
import { toDiscussionDetail, toDiscussionSummary } from '../../../utils/serializers';

const UID = 'api::discussion.discussion';
const CATEGORY_UID = 'api::category.category';

const AUTHOR_POPULATE = { fields: ['username'] };
const CATEGORY_POPULATE = { fields: ['name', 'slug'] };

type ListParams = {
  page: number;
  pageSize: number;
  sort: 'asc' | 'desc';
  category?: string;
  q?: string;
};

export default factories.createCoreService(UID, ({ strapi }) => {
  const docs = () => strapi.documents(UID) as any;

  return {
    async list({ page, pageSize, sort, category, q }: ListParams) {
      const filters: Record<string, unknown> = {};
      if (category) filters.category = { slug: { $eq: category } };
      if (q) {
        filters.$or = [{ title: { $containsi: q } }, { content: { $containsi: q } }];
      }

      const [rows, total] = await Promise.all([
        docs().findMany({
          filters,
          sort: [`createdAt:${sort}`],
          limit: pageSize,
          start: (page - 1) * pageSize,
          fields: ['title', 'slug', 'type', 'content', 'createdAt'],
          populate: {
            author: AUTHOR_POPULATE,
            category: CATEGORY_POPULATE,
            replies: { count: true },
          },
        }),
        docs().count({ filters }),
      ]);

      return {
        data: rows.map(toDiscussionSummary),
        meta: {
          pagination: { page, pageSize, pageCount: Math.max(1, Math.ceil(total / pageSize)), total },
        },
      };
    },

    async findBySlug(slug: string) {
      const doc = await docs().findFirst({
        filters: { slug: { $eq: slug } },
        fields: ['title', 'slug', 'type', 'content', 'createdAt'],
        populate: {
          author: AUTHOR_POPULATE,
          category: CATEGORY_POPULATE,
          replies: {
            sort: ['createdAt:asc'],
            fields: ['content', 'createdAt'],
            populate: { author: AUTHOR_POPULATE },
          },
        },
      });
      return doc ? toDiscussionDetail(doc) : null;
    },

    /** L'auteur vient TOUJOURS de l'utilisateur authentifié, jamais du body. */
    async createForUser(
      user: { id: number | string; documentId?: string },
      input: { title: string; content: string; type: string; category: string }
    ) {
      const category: any = await (strapi.documents(CATEGORY_UID) as any).findFirst({
        filters: { $or: [{ documentId: { $eq: input.category } }, { slug: { $eq: input.category } }] },
        fields: ['name'],
      });
      if (!category) {
        throwIssues([{ path: ['category'], message: 'Catégorie inconnue.' }]);
      }

      let slug = uniqueSlug(input.title);
      for (let i = 0; i < 5; i++) {
        const taken = await docs().count({ filters: { slug: { $eq: slug } } });
        if (!taken) break;
        slug = uniqueSlug(input.title);
      }

      const created = await docs().create({
        data: {
          title: input.title,
          slug,
          content: input.content,
          type: input.type,
          category: category.documentId,
          author: user.documentId ?? user.id,
        },
        fields: ['title', 'slug', 'type', 'content', 'createdAt'],
        populate: { author: AUTHOR_POPULATE, category: CATEGORY_POPULATE },
      });
      return toDiscussionDetail(created);
    },
  };
});
