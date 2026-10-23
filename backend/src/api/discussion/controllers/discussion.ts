import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { parseDiscussionInput, parseListQuery } from '../../../utils/validation';

const UID = 'api::discussion.discussion';

export default factories.createCoreController(UID, ({ strapi }) => ({
  /** GET /api/discussions?category=&sort=createdAt:desc&page=1&pageSize=10&q= */
  async find(ctx) {
    const params = parseListQuery(ctx.query as Record<string, unknown>);
    ctx.body = await strapi.service(UID).list(params);
  },

  /** GET /api/discussions/slug/:slug */
  async findBySlug(ctx) {
    const data = await strapi.service(UID).findBySlug(ctx.params.slug);
    if (!data) throw new errors.NotFoundError('Discussion introuvable.');
    ctx.body = { data };
  },

  /** POST /api/discussions  { data: { title, content, type, category } } */
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) throw new errors.UnauthorizedError('Authentification requise.');

    const input = parseDiscussionInput(ctx.request.body?.data);
    const data = await strapi.service(UID).createForUser(user, input);

    ctx.status = 201;
    ctx.body = { data };
  },
}));
