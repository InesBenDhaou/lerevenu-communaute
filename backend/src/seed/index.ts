/**
 * Données de démonstration. Idempotent : ne fait rien si des catégories existent déjà.
 * Désactivable avec SEED_ON_BOOT=false.
 */
import type { Core } from '@strapi/strapi';

export const DEMO_PASSWORD = 'Demo1234!';

const USERS = [
  { username: 'alice', email: 'alice@demo.test' },
  { username: 'bob', email: 'bob@demo.test' },
  { username: 'claire', email: 'claire@demo.test' },
  { username: 'redaction', email: 'redaction@demo.test' },
];

const CATEGORIES = [
  ['Bourse & actions', 'bourse', "Actions, ETF, PEA, compte-titres : stratégies et retours d'expérience."],
  ['Économie', 'economie', "Conjoncture, taux, inflation, emploi : l'actualité économique."],
  ['Épargne & placements', 'epargne', 'Livrets, fonds euros, obligations, comptes à terme.'],
  ['Assurance-vie', 'assurance-vie', 'Choisir son contrat, arbitrer, transmettre.'],
  ['Immobilier & SCPI', 'immobilier', 'Résidence principale, locatif, SCPI, crédit immobilier.'],
  ['Impôts & fiscalité', 'impots', 'Déclaration, niches fiscales, IFI : payer le juste impôt.'],
  ['Retraite', 'retraite', 'PER, rachat de trimestres, cumul emploi-retraite.'],
  ['Famille & transmission', 'transmission', 'Donation, succession, protection du conjoint.'],
  ['Or, cryptos & alternatifs', 'alternatifs', 'Or physique, cryptoactifs, forêts, private equity.'],
  ['Budget & conso', 'budget', 'Banques, crédits, assurances, bons plans.'],
  ['Le Café du Revenu', 'cafe', 'Présentations, discussions libres, idées pour la rédaction.'],
] as const;

type SeedDiscussion = {
  title: string;
  category: string;
  type: 'question' | 'discussion';
  author: string;
  minutesAgo: number;
  content: string;
  replies: { author: string; minutesAgo: number; content: string }[];
};

const DISCUSSIONS: SeedDiscussion[] = [
  {
    title: 'PEA ou assurance-vie pour investir sur un ETF World ?',
    category: 'bourse',
    type: 'question',
    author: 'alice',
    minutesAgo: 90,
    content:
      "Je débute et je souhaite investir 300 € par mois sur un ETF World en réplication physique.\nJe n'arrive pas à choisir entre un PEA et une assurance-vie. Quels sont les avantages de chaque enveloppe à long terme ?",
    replies: [
      { author: 'bob', minutesAgo: 70, content: "Le PEA est imbattable fiscalement après 5 ans, mais l'ETF World n'y est éligible que via un ETF synthétique." },
      { author: 'redaction', minutesAgo: 45, content: "Pensez aussi à la souplesse : l'assurance-vie reste plus simple pour la transmission." },
      { author: 'alice', minutesAgo: 20, content: 'Merci, je vais comparer les frais des deux enveloppes.' },
    ],
  },
  {
    title: 'Que pensez-vous du nouveau taux du Livret A ?',
    category: 'epargne',
    type: 'discussion',
    author: 'bob',
    minutesAgo: 240,
    content: "Le taux a changé ce trimestre. Est-ce encore pertinent de garder plus que son épargne de précaution dessus ?",
    replies: [
      { author: 'claire', minutesAgo: 200, content: "Au-delà de 3 mois de dépenses, je préfère un fonds euros ou un compte à terme." },
    ],
  },
  {
    title: 'Comment déclarer des revenus de SCPI en 2026 ?',
    category: 'immobilier',
    type: 'question',
    author: 'claire',
    minutesAgo: 600,
    content: "J'ai acheté des parts de SCPI l'an dernier. Quelle case pour les revenus fonciers, et que se passe-t-il pour les parts détenues à l'étranger ?",
    replies: [
      { author: 'redaction', minutesAgo: 500, content: "Les revenus fonciers vont en 2044 (régime réel) ou 2042 (micro-foncier). Les SCPI étrangères ont un traitement spécifique." },
      { author: 'bob', minutesAgo: 480, content: 'Vérifiez le relevé fiscal envoyé par votre société de gestion, il indique les montants à reporter.' },
    ],
  },
  {
    title: 'PER : faut-il vraiment déduire ses versements aujourd’hui ?',
    category: 'retraite',
    type: 'discussion',
    author: 'alice',
    minutesAgo: 1500,
    content: "Tout le monde parle de la déduction fiscale, mais qu'en est-il de la fiscalité à la sortie ? Je veux comprendre pour quelle tranche marginale d'imposition le PER devient intéressant.",
    replies: [
      { author: 'claire', minutesAgo: 1400, content: "À partir de 30 % de TMI, c'est généralement intéressant ; en dessous, c'est à étudier." },
    ],
  },
  {
    title: 'Donation à mes enfants : démembrement ou donation simple ?',
    category: 'transmission',
    type: 'question',
    author: 'bob',
    minutesAgo: 3000,
    content: "Je souhaite transmettre un bien immobilier tout en gardant l'usage. Quels sont les avantages du démembrement de propriété ?",
    replies: [],
  },
  {
    title: 'Or physique ou ETF or : quel est votre choix ?',
    category: 'alternatifs',
    type: 'discussion',
    author: 'claire',
    minutesAgo: 4300,
    content: "Entre frais de stockage, fiscalité et liquidité, je n'arrive pas à trancher. Partagez vos retours d'expérience.",
    replies: [
      { author: 'alice', minutesAgo: 4200, content: "J'ai opté pour un ETF adossé à de l'or physique : plus simple à revendre." },
      { author: 'bob', minutesAgo: 4100, content: "Les pièces ont une fiscalité particulière à la revente, à vérifier avant d'acheter." },
    ],
  },
  {
    title: 'Comment réduire ses frais bancaires sans changer de banque ?',
    category: 'budget',
    type: 'question',
    author: 'redaction',
    minutesAgo: 6000,
    content: 'Frais de tenue de compte, cartes, découverts : partagez vos astuces pour négocier ou supprimer des frais inutiles.',
    replies: [],
  },
  {
    title: 'Bienvenue dans la communauté du Revenu !',
    category: 'cafe',
    type: 'discussion',
    author: 'redaction',
    minutesAgo: 9000,
    content: "Présentez-vous, dites-nous ce qui vous amène et quelles questions d'argent vous préoccupent en ce moment.",
    replies: [
      { author: 'alice', minutesAgo: 8800, content: 'Bonjour à tous, je débute en bourse et je suis ravie de rejoindre la communauté.' },
    ],
  },
];

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000);

export async function seedDemoData(strapi: Core.Strapi) {
  const categories = strapi.documents('api::category.category') as any;
  if ((await categories.count({})) > 0) {
    strapi.log.info('[seed] Données déjà présentes : seed ignoré.');
    return;
  }
  strapi.log.info('[seed] Initialisation des données de démonstration…');

  // 1. Utilisateurs (rôle Authenticated). Mot de passe haché par le service Strapi.
  const authRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'authenticated' } });
  const userService = strapi.plugin('users-permissions').service('user');
  const usersByName: Record<string, any> = {};
  for (const u of USERS) {
    let user = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email: u.email } });
    if (!user) {
      user = await userService.add({
        ...u,
        password: DEMO_PASSWORD,
        provider: 'local',
        confirmed: true,
        blocked: false,
        role: authRole.id,
      });
    }
    usersByName[u.username] = user;
  }

  // 2. Catégories
  const categoryBySlug: Record<string, any> = {};
  for (const [name, slug, description] of CATEGORIES) {
    categoryBySlug[slug] = await categories.create({ data: { name, slug, description } });
  }

  // 3. Discussions + réponses (dates antidatées pour un fil réaliste)
  const discussions = strapi.documents('api::discussion.discussion') as any;
  const replies = strapi.documents('api::reply.reply') as any;
  const backdate = (uid: any, documentId: string, date: Date) =>
    strapi.db.query(uid).update({ where: { documentId }, data: { createdAt: date } });

  for (const d of DISCUSSIONS) {
    const slugBase = d.title
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/g, '');
    const created = await discussions.create({
      data: {
        title: d.title,
        slug: `${slugBase}-demo`,
        content: d.content,
        type: d.type,
        author: usersByName[d.author].documentId,
        category: categoryBySlug[d.category].documentId,
      },
    });
    await backdate('api::discussion.discussion', created.documentId, minutesAgo(d.minutesAgo));

    for (const r of d.replies) {
      const reply = await replies.create({
        data: {
          content: r.content,
          author: usersByName[r.author].documentId,
          discussion: created.documentId,
        },
      });
      await backdate('api::reply.reply', reply.documentId, minutesAgo(r.minutesAgo));
    }
  }
  strapi.log.info(`[seed] OK : ${CATEGORIES.length} catégories, ${DISCUSSIONS.length} discussions, ${USERS.length} utilisateurs (mot de passe : ${DEMO_PASSWORD}).`);
}
