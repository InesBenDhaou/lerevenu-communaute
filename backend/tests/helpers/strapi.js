const fs = require('fs');
const path = require('path');
const { compileStrapi, createStrapi } = require('@strapi/strapi');

let instance;

/** Démarre une instance Strapi réelle (sans écouter de port) sur une base SQLite vierge. */
async function setupStrapi() {
  if (instance) return instance;
  const dbFile = path.join(process.cwd(), process.env.DATABASE_FILENAME);
  fs.rmSync(dbFile, { force: true });

  const appContext = await compileStrapi();
  instance = await createStrapi(appContext).load();
  await instance.server.mount();
  return instance;
}

async function teardownStrapi() {
  if (!instance) return;
  const dbFile = path.join(process.cwd(), process.env.DATABASE_FILENAME);
  await instance.destroy();
  instance = undefined;
  fs.rmSync(dbFile, { force: true });
}

/** Crée un utilisateur "authenticated" et retourne { user, jwt }. */
async function createUser(strapi, username) {
  const role = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });
  const user = await strapi.plugin('users-permissions').service('user').add({
    username,
    email: `${username}@test.local`,
    password: 'Test1234!',
    provider: 'local',
    confirmed: true,
    blocked: false,
    role: role.id,
  });
  const jwt = strapi.plugin('users-permissions').service('jwt').issue({ id: user.id });
  return { user, jwt };
}

module.exports = { setupStrapi, teardownStrapi, createUser };
