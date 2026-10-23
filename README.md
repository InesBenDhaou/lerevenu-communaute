# Communauté Le Revenu : test technique

Mini-communauté de discussions (questions, discussions, réponses) construite à partir de la maquette HTML fournie.

| Couche          | Technologie                                                         |
| --------------- | ------------------------------------------------------------------- |
| Frontend        | Next.js 16 (App Router), React, TypeScript, Tailwind CSS 4          |
| Backend / CMS   | Strapi 5 (TypeScript), plugin Users & Permissions                   |
| Base de données | **PostgreSQL** (Docker) **ou SQLite** (zéro installation), au choix |
| Tests           | Jest + Supertest (backend), Vitest + Testing Library (frontend)     |

---

## 1. Démarrage rapide (SQLite, 2 terminaux, sans Docker)

**Prérequis** : Node.js 20 ou 22 (testé avec 22) et npm. Rien d'autre.

### Terminal 1 : le backend (http://localhost:1337)

```bash
cd backend
cp .env.example .env          # Windows (cmd) : copy .env.example .env
npm install
npm run develop:sqlite
```

Attendez le message `Strapi started successfully`. Au tout premier démarrage, vous verrez aussi
`[seed] OK : 11 catégories, 8 discussions, 4 utilisateurs` : les données de démonstration sont créées automatiquement.

### Terminal 2 : le frontend (http://localhost:3000)

```bash
cd frontend
cp .env.example .env.local    # Windows (cmd) : copy .env.example .env.local
npm install
npm run dev
```

### Essayer l'application

Ouvrez **http://localhost:3000**.

1. Parcourez les discussions : filtre par catégorie (colonne de gauche), tri, recherche, pagination.
2. Cliquez sur une discussion pour voir son détail et ses réponses.
3. Cliquez sur **Se connecter** puis sur « Remplir avec Alice » (ou saisissez `alice@demo.test` / `Demo1234!`).
4. Publiez une nouvelle discussion et ajoutez une réponse.

**Comptes de démonstration** (mot de passe commun : `Demo1234!`) :
`alice@demo.test`, `bob@demo.test`, `claire@demo.test`, `redaction@demo.test`.

> **Pas d'inscription** : le sujet précise que l'authentification complète n'est pas obligatoire et propose
> des utilisateurs de démonstration. Seule la connexion est implémentée (via Users & Permissions de Strapi).

---

## 2. SQLite ou PostgreSQL : pourquoi les deux ?

Petite précision pour éviter toute confusion : **l'annonce LinkedIn** mentionne une base **SQLite**, alors que **le sujet du test (PDF)** demande **PostgreSQL**.

Plutôt que de choisir, j'ai fait en sorte que le projet fonctionne avec les deux :

- **PostgreSQL** est la base principale, comme demandé dans le sujet (via Docker Compose).
- **SQLite** est disponible pour tester l'application en deux minutes, sans rien installer
  (et avec une base de démonstration déjà remplie).

C'est exactement le même code dans les deux cas : seul le fichier `backend/.env` change.
Si vous voulez simplement voir l'application tourner, suivez la section 1 (SQLite).
Si vous voulez vérifier la configuration PostgreSQL du sujet, suivez la suite de cette section.

|                     | SQLite                                             | PostgreSQL                            |
| ------------------- | -------------------------------------------------- | ------------------------------------- |
| Installation        | Aucune (un simple fichier)                         | Docker requis                         |
| Où sont les données | `backend/.tmp/data.db`                             | Volume Docker `pgdata`                |
| Pour qui            | Tester rapidement (recommandé pour une évaluation) | Environnement proche de la production |
| Commande backend    | `npm run develop:sqlite`                           | `npm run develop`                     |
| Variable clé        | `DATABASE_CLIENT=sqlite`                           | `DATABASE_CLIENT=postgres`            |

Le fichier `backend/.env.example` contient les deux configurations : **SQLite est active par défaut**, le bloc
PostgreSQL est commenté. Le script `develop:sqlite` force de toute façon SQLite, quel que soit le contenu de `.env`.

### Utiliser PostgreSQL

```bash
# 1. À la racine du projet : démarrer PostgreSQL
docker compose up -d
docker compose ps              # le service doit être "healthy"

# 2. Dans backend/.env : commenter le bloc SQLite et décommenter le bloc PostgreSQL
#    (host localhost, port 5432, base/utilisateur "lerevenu", mot de passe "lerevenu_dev")

# 3. Lancer le backend (le seed s'exécute au premier démarrage sur la base vide)
cd backend
npm run develop
```

Pour vérifier que les données sont bien dans PostgreSQL :

```bash
docker exec -it lerevenu-postgres psql -U lerevenu -d lerevenu -c "\dt"
```

### Données de démonstration et remise à zéro

- **Seed automatique** : exécuté au démarrage **uniquement si la base ne contient aucune catégorie** (idempotent).
  Désactivable avec `SEED_ON_BOOT=false` dans `backend/.env`.
- **Base SQLite déjà remplie** : `backend/database/demo/data.db`. Pour repartir de cet état, arrêtez Strapi puis :
  ```bash
  cd backend && npm run db:demo
  ```
- **Tout réinitialiser** :
  - SQLite : arrêtez Strapi, supprimez `backend/.tmp/data.db`, relancez (le seed recrée tout).
  - PostgreSQL : `docker compose down -v` puis `docker compose up -d`, et relancez le backend.

---

## 4. Tests automatisés

### Backend : 13 tests d'intégration

```bash
cd backend
npm test
```

Chaque exécution démarre une **vraie instance Strapi** sur une base SQLite **temporaire et jetable** (`backend/.tmp/test.db`,
supprimée à la fin). Elle ne touche ni votre base de développement ni PostgreSQL, et ne nécessite ni Docker ni serveur lancé.
Compter environ 20 à 30 secondes (compilation TypeScript + démarrage de Strapi).

| Exigence du sujet                        | Test                                                                                                                                                    |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validation d'une discussion              | titre < 10 caractères (400, erreur sur `title`), titre d'espaces uniquement, contenu vide, type invalide, catégorie inconnue, création valide avec slug |
| Refus de la publication non authentifiée | création de discussion et de réponse sans token (403), token invalide (401)                                                                             |
| Protection contre l'usurpation d'auteur  | `author` d'un autre utilisateur refusé (403) sur discussion et réponse ; l'auteur d'une réponse valide est bien l'utilisateur authentifié               |
| Affichage des discussions                | liste paginée avec auteur, catégorie, nombre de réponses, aucun email exposé ; filtre ; tri non autorisé rejeté ; détail par slug avec réponses ; 404   |

### Frontend : 12 tests

```bash
cd frontend
npm test              # Vitest + Testing Library
npm run typecheck     # vérification TypeScript
npm run lint          # ESLint
```

Ils couvrent l'affichage des discussions (titre, auteur, catégorie, pluriel des réponses, ordre, états vides,
absence d'injection HTML), la validation côté client et la construction d'URL (dont le blocage des redirections externes).

---

## 5. API

Base : `http://localhost:1337/api`. Les routes de lecture peuvent être ouvertes directement dans le navigateur.

| Méthode | Route                                                                          | Accès    | Description                                                    |
| ------- | ------------------------------------------------------------------------------ | -------- | -------------------------------------------------------------- |
| GET     | `/categories`                                                                  | public   | Catégories + nombre de discussions                             |
| GET     | `/discussions?category=&sort=createdAt:desc\|createdAt:asc&page=&pageSize=&q=` | public   | Liste paginée (`pageSize` ≤ 50)                                |
| GET     | `/discussions/slug/:slug`                                                      | public   | Détail + réponses (ordre chronologique)                        |
| POST    | `/discussions`                                                                 | connecté | `{ "data": { "title", "content", "type", "category" } }` → 201 |
| POST    | `/replies`                                                                     | connecté | `{ "data": { "content", "discussion": "<id>" } }` → 201        |
| POST    | `/auth/local`                                                                  | public   | `{ "identifier", "password" }` → `{ jwt, user }`               |

Les routes d'écriture exigent l'en-tête `Authorization: Bearer <jwt>`.

| Code | Signification                                                       |
| ---- | ------------------------------------------------------------------- |
| 400  | Validation (détail par champ dans `error.details.errors[].path`)    |
| 401  | Token invalide ou expiré                                            |
| 403  | Utilisateur non connecté, ou tentative de publier au nom d'un autre |
| 404  | Discussion introuvable                                              |

---

## 6. Choix d'architecture

### Backend (Strapi)

- **Strapi est l'autorité** : validation, authentification et autorisation sont faites côté serveur. La validation du
  frontend n'est qu'un confort ; un appel direct à l'API ne contourne rien.
- **Anti-usurpation en deux couches** : la policy `global::forbid-author-spoofing` rejette un `author` différent du JWT,
  et les controllers ignorent de toute façon le body pour l'auteur (`author = ctx.state.user`).
- **Permissions dans le code** (`src/utils/permissions.ts`, idempotent au démarrage) : reproductible, aucun réglage manuel dans l'admin.
- **Sorties explicites** (`src/utils/serializers.ts`) : la relation `author` n'expose que `username`. Sinon, Strapi
  obligerait à ouvrir `GET /api/users` au public pour afficher les auteurs, ce qui exposerait les e-mails.
- **Surface d'API minimale** : seulement `find` et `create` ; pas d'update ni de delete exposés.
- **Pas de N+1** : une requête avec `populate` ciblé, nombre de réponses via `populate.count`.
- **Slug** généré côté serveur (titre normalisé + suffixe aléatoire) : URL propre et unicité.
- **JWT en mode `legacy-support`** (`config/plugins.ts`) : Strapi 5.59 propose par défaut un mode refresh-token, plus lourd que nécessaire ici.

### Frontend (Next.js)

- **Server Components par défaut** : listes et détail rendus côté serveur. Les composants client se limitent aux formulaires et aux boutons de pré-remplissage.
- **Filtres, tri, recherche et pagination dans l'URL** (`?category=&sort=&q=&page=`) : pages partageables, SEO, bouton retour fonctionnel, aucun état client.
- **Server Actions** pour connexion, publication et réponse. Le JWT vit dans un **cookie httpOnly** : illisible par le JavaScript du navigateur, et aucun CORS à gérer.
- **Client API unique** (`src/lib/strapi.ts`, `server-only`) : typé, erreurs normalisées avec détail par champ.
- **Cache** : discussions et réponses en `no-store` (données vivantes), catégories en `revalidate: 60`, `revalidatePath` après chaque mutation.
- **États** : squelette de chargement, page d'erreur, vrai 404, états vides, formulaires accessibles (`aria-invalid`, `role="alert"`).
- **Sécurité** : contenu rendu en texte (pas de `dangerouslySetInnerHTML`), paramètre `?next=` limité aux chemins internes.

### Périmètre et limites assumées

Livré : accueil (liste, filtre par catégorie, tri, recherche, pagination), détail par slug, création, réponses, connexion, seed, tests.
Non livré (hors périmètre) : inscription, édition/suppression, mode sombre, widgets de la maquette (points, badges, sondages).
Pistes : pagination des réponses, limitation de débit, Dockerfiles complets, tests E2E Playwright, documentation OpenAPI.

---

## 7. Dépannage

| Symptôme                                                       | Cause et solution                                                                                                                                       |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Le site affiche « Le service est momentanément indisponible »  | Strapi n'est pas lancé : démarrez le backend (terminal 1).                                                                                              |
| `EADDRINUSE` sur 1337 ou 3000                                  | Un autre processus utilise le port : fermez-le, ou changez `PORT` (backend) / lancez `npm run dev -- -p 3001` (frontend, puis rien d'autre à modifier). |
| Les discussions ne s'affichent pas après un changement de base | Le seed ne s'exécute que sur une base **vide**. Réinitialisez la base (voir § 2).                                                                       |
| `ERESOLVE` à `npm install` dans `frontend`                     | Un fichier `.npmrc` (`legacy-peer-deps=true`) est fourni. Sinon : `npm install --legacy-peer-deps`.                                                     |
| Strapi ne se connecte pas à PostgreSQL                         | Vérifiez `docker compose ps` (« healthy »), puis que `backend/.env` utilise bien le bloc PostgreSQL (et le bon port).                                   |
| Connexion refusée                                              | Utilisez exactement `alice@demo.test` / `Demo1234!` (la base doit contenir le seed).                                                                    |
| Polices non chargées au build                                  | `next/font` télécharge Inter et Playfair Display depuis Google Fonts : une connexion Internet est nécessaire pour `npm run build`.                      |

---

## 8. Structure du dépôt

```
backend/                                 Strapi 5
  src/api/{category,discussion,reply}/   schémas, routes, controllers, services
  src/policies/                          forbid-author-spoofing
  src/utils/                             validation, serializers, slug, permissions
  src/seed/                              données de démonstration
  tests/                                 Jest + Supertest
  database/demo/data.db                  base SQLite prête à l'emploi
  .env.example                           configuration (SQLite par défaut, PostgreSQL en option)
frontend/                                Next.js 16
  src/app/                               pages (accueil, discussions/[slug], discussions/new, login)
  src/actions/                           Server Actions
  src/components/  src/lib/              UI et client API
docker-compose.yml                       PostgreSQL 16
```

Note : les secrets de `backend/.env.example` sont des valeurs factices de développement local, pas de vrais secrets.
