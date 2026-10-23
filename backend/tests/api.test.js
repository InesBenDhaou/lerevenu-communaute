const request = require('supertest');
const { setupStrapi, teardownStrapi, createUser } = require('./helpers/strapi');

let strapi;
let alice;
let bob;
let category;

const http = () => request(strapi.server.httpServer);
const validDiscussion = () => ({
  title: 'Comment choisir son enveloppe fiscale ?',
  content: 'Je cherche des conseils pour débuter.',
  type: 'question',
  category: category.slug,
});

beforeAll(async () => {
  strapi = await setupStrapi();
  alice = await createUser(strapi, 'alice');
  bob = await createUser(strapi, 'bob');
  category = await strapi.documents('api::category.category').create({
    data: { name: 'Bourse', slug: 'bourse', description: 'Test' },
  });
});

afterAll(teardownStrapi);

describe('Validation d’une discussion (côté Strapi)', () => {
  it('refuse un titre de moins de 10 caractères (400 + erreur sur le champ title)', async () => {
    const res = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: { ...validDiscussion(), title: 'court' } });

    expect(res.status).toBe(400);
    expect(res.body.error.name).toBe('ValidationError');
    expect(res.body.error.details.errors[0].path).toEqual(['title']);
  });

  it('refuse un titre composé uniquement d’espaces', async () => {
    const res = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: { ...validDiscussion(), title: '            ' } });
    expect(res.status).toBe(400);
  });

  it('refuse un contenu vide, un type invalide et une catégorie inconnue', async () => {
    const res = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: { ...validDiscussion(), content: '', type: 'autre', category: 'inconnue' } });

    expect(res.status).toBe(400);
    const paths = res.body.error.details.errors.map((e) => e.path[0]);
    expect(paths).toEqual(expect.arrayContaining(['content', 'type']));

    const unknownCategory = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: { ...validDiscussion(), category: 'inconnue' } });
    expect(unknownCategory.status).toBe(400);
    expect(unknownCategory.body.error.details.errors[0].path).toEqual(['category']);
  });

  it('crée une discussion valide, génère un slug et rattache l’auteur authentifié', async () => {
    const res = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: validDiscussion() });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toMatch(/^comment-choisir-son-enveloppe-fiscale-[a-f0-9]{6}$/);
    expect(res.body.data.author.username).toBe('alice');
  });
});

describe('Publication non authentifiée', () => {
  it('refuse la création d’une discussion sans token', async () => {
    const res = await http().post('/api/discussions').send({ data: validDiscussion() });
    expect(res.status).toBe(403);
  });

  it('refuse la création d’une réponse sans token', async () => {
    const res = await http().post('/api/replies').send({ data: { content: 'Bonjour', discussion: 'x' } });
    expect(res.status).toBe(403);
  });

  it('refuse un token invalide (401)', async () => {
    const res = await http()
      .post('/api/discussions')
      .set('Authorization', 'Bearer token-invalide')
      .send({ data: validDiscussion() });
    expect(res.status).toBe(401);
  });
});

describe('Protection contre l’usurpation d’auteur', () => {
  it('refuse une discussion publiée avec le champ author d’un autre utilisateur', async () => {
    const res = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: { ...validDiscussion(), author: bob.user.documentId } });

    expect(res.status).toBe(403);
    const count = await strapi.documents('api::discussion.discussion').count({
      filters: { author: { documentId: bob.user.documentId } },
    });
    expect(count).toBe(0);
  });

  it('refuse une réponse publiée au nom d’un autre utilisateur', async () => {
    const created = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: validDiscussion() });

    const res = await http()
      .post('/api/replies')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: { content: 'Usurpation', discussion: created.body.data.id, author: bob.user.id } });
    expect(res.status).toBe(403);
  });

  it('force l’auteur de la réponse à l’utilisateur authentifié', async () => {
    const created = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: validDiscussion() });

    const res = await http()
      .post('/api/replies')
      .set('Authorization', `Bearer ${bob.jwt}`)
      .send({ data: { content: 'Voici ma réponse', discussion: created.body.data.id } });

    expect(res.status).toBe(201);
    expect(res.body.data.author.username).toBe('bob');
  });
});

describe('Lecture publique des discussions', () => {
  it('liste paginée avec auteur, catégorie, nombre de réponses, et sans fuite d’email', async () => {
    const res = await http().get('/api/discussions?pageSize=2&sort=createdAt:desc');

    expect(res.status).toBe(200);
    expect(res.body.meta.pagination).toMatchObject({ page: 1, pageSize: 2 });
    expect(res.body.data.length).toBeLessThanOrEqual(2);

    const first = res.body.data[0];
    expect(first).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        slug: expect.any(String),
        repliesCount: expect.any(Number),
        author: expect.objectContaining({ username: expect.any(String) }),
        category: expect.objectContaining({ slug: 'bourse' }),
      })
    );
    expect(JSON.stringify(res.body)).not.toContain('@test.local');
  });

  it('filtre par catégorie et rejette un tri non autorisé', async () => {
    const filtered = await http().get('/api/discussions?category=inexistante');
    expect(filtered.status).toBe(200);
    expect(filtered.body.data).toHaveLength(0);

    const badSort = await http().get('/api/discussions?sort=password:asc');
    expect(badSort.status).toBe(400);
  });

  it('retourne le détail par slug avec ses réponses, et 404 si inconnu', async () => {
    const created = await http()
      .post('/api/discussions')
      .set('Authorization', `Bearer ${alice.jwt}`)
      .send({ data: validDiscussion() });
    await http()
      .post('/api/replies')
      .set('Authorization', `Bearer ${bob.jwt}`)
      .send({ data: { content: 'Réponse de Bob', discussion: created.body.data.id } });

    const detail = await http().get(`/api/discussions/slug/${created.body.data.slug}`);
    expect(detail.status).toBe(200);
    expect(detail.body.data.replies).toHaveLength(1);
    expect(detail.body.data.replies[0].author.username).toBe('bob');

    const missing = await http().get('/api/discussions/slug/n-existe-pas');
    expect(missing.status).toBe(404);
  });
});
