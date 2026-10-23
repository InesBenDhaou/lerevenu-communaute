/**
 * Permissions Users & Permissions appliquées au démarrage (idempotent).
 * Elles vivent donc dans le code versionné, pas dans des clics d'admin non reproductibles.
 * Le contrôle d'accès est fait par Strapi : le frontend n'est jamais la source de vérité.
 */
import type { Core } from '@strapi/strapi';

const READ_ACTIONS = [
  'api::category.category.find',
  'api::discussion.discussion.find',
  'api::discussion.discussion.findBySlug',
];

const WRITE_ACTIONS = [
  'api::discussion.discussion.create',
  'api::reply.reply.create',
  'plugin::users-permissions.user.me',
];

const PERMISSION_UID = 'plugin::users-permissions.permission';
const ROLE_UID = 'plugin::users-permissions.role';

async function grant(strapi: Core.Strapi, roleId: number, actions: string[]) {
  for (const action of actions) {
    const existing = await strapi.db.query(PERMISSION_UID).findOne({ where: { action, role: roleId } });
    if (!existing) {
      await strapi.db.query(PERMISSION_UID).create({ data: { action, role: roleId } });
    }
  }
}

export async function ensureRolePermissions(strapi: Core.Strapi) {
  const roles = await strapi.db.query(ROLE_UID).findMany();
  const publicRole = roles.find((role: any) => role.type === 'public');
  const authenticatedRole = roles.find((role: any) => role.type === 'authenticated');

  if (!publicRole || !authenticatedRole) {
    strapi.log.warn('Rôles Users & Permissions introuvables : permissions non appliquées.');
    return;
  }

  // Visiteur anonyme : lecture seule. AUCUNE écriture.
  await grant(strapi, publicRole.id, READ_ACTIONS);
  // Utilisateur connecté : lecture + publication.
  await grant(strapi, authenticatedRole.id, [...READ_ACTIONS, ...WRITE_ACTIONS]);
}
