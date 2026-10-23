import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { parseReplyInput } from '../../../utils/validation';

const UID = 'api::reply.reply';

export default factories.createCoreController(UID, ({ strapi }) => ({
  /** POST /api/replies  { data: { content, discussion: <documentId> } } */
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) throw new errors.UnauthorizedError('Authentification requise.');

    const input = parseReplyInput(ctx.request.body?.data);
    const data = await strapi.service(UID).createForUser(user, input);

    ctx.status = 201;
    ctx.body = { data };
  },
}));
