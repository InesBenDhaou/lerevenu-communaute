import { errors } from '@strapi/utils';

/**
 * Policy de route : refuse explicitement toute tentative de publier "au nom de" quelqu'un d'autre.
 *
 * Défense en profondeur :
 *  1. cette policy rejette (403) un body contenant un `author` différent de l'utilisateur authentifié ;
 *  2. les controllers ignorent de toute façon le body et forcent `author = ctx.state.user`.
 */
export default (policyContext: any) => {
  const user = policyContext.state?.user;
  if (!user) {
    throw new errors.UnauthorizedError('Authentification requise.');
  }

  const data = policyContext.request?.body?.data;
  if (data && typeof data === 'object' && 'author' in data) {
    const claimed = String((data as Record<string, unknown>).author);
    const allowed = [user.id, user.documentId].filter(Boolean).map(String);
    if (!allowed.includes(claimed)) {
      throw new errors.ForbiddenError("Vous ne pouvez pas publier au nom d'un autre utilisateur.");
    }
  }
  return true;
};
