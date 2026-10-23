import { factories } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { toReply } from '../../../utils/serializers';

const UID = 'api::reply.reply';
const DISCUSSION_UID = 'api::discussion.discussion';

export default factories.createCoreService(UID, ({ strapi }) => ({
  async createForUser(
    user: { id: number | string; documentId?: string },
    input: { content: string; discussion: string }
  ) {
    const discussion: any = await (strapi.documents(DISCUSSION_UID) as any).findOne({
      documentId: input.discussion,
      fields: ['title'],
    });
    if (!discussion) throw new errors.NotFoundError('Discussion introuvable.');

    const created = await (strapi.documents(UID) as any).create({
      data: {
        content: input.content,
        discussion: discussion.documentId,
        author: user.documentId ?? user.id, // jamais lu depuis le body
      },
      fields: ['content', 'createdAt'],
      populate: { author: { fields: ['username'] } },
    });
    return toReply(created);
  },
}));
