import { factories } from '@strapi/strapi';
import { toCategoryRef } from '../../../utils/serializers';

const UID = 'api::category.category';

export default factories.createCoreService(UID, ({ strapi }) => ({
  async listWithCounts() {
    const rows: any[] = await (strapi.documents(UID) as any).findMany({
      sort: ['id:asc'],
      limit: 100,
      populate: { discussions: { count: true } },
    });
    return rows.map((c) => ({
      ...toCategoryRef(c),
      description: c.description ?? '',
      discussionsCount: c.discussions?.count ?? 0,
    }));
  },
}));
