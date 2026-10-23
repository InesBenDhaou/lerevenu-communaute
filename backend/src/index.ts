import type { Core } from '@strapi/strapi';
import { ensureRolePermissions } from './utils/permissions';
import { seedDemoData } from './seed';

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // 1. Permissions (toujours) : source de vérité de la sécurité, versionnée dans le code.
    await ensureRolePermissions(strapi);

    // 2. Données de démo (au premier démarrage uniquement, désactivable).
    if (process.env.SEED_ON_BOOT !== 'false') {
      try {
        await seedDemoData(strapi);
      } catch (error) {
        strapi.log.error('[seed] Échec du seed de démonstration', error);
      }
    }
  },
};
