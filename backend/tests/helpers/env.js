// Base SQLite isolée et jetable pour les tests : aucun impact sur la base de développement.
const path = require('path');
process.env.NODE_ENV = 'test';
process.env.DATABASE_CLIENT = 'sqlite';
process.env.DATABASE_FILENAME = path.join('.tmp', 'test.db');
process.env.SEED_ON_BOOT = 'false';
process.env.PORT = '0';
