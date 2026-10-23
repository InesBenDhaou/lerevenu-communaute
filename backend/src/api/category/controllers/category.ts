import { factories } from '@strapi/strapi';

const UID = 'api::category.category';

export default factories.createCoreController(UID, ({ strapi }) => ({
  async find(ctx) {
    const data = await strapi.service(UID).listWithCounts();
    ctx.body = { data };
  },
}));
