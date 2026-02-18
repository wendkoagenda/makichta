# Déploiement sur Hostinger

## Variables d'environnement

### Où les renseigner

- Dans le panneau Hostinger : section **Variables d'environnement** (ou équivalent selon votre type d'hébergement)
- Ou dans un fichier `.env` à la racine du projet
- **Important** : vérifier que `.env` est dans `.gitignore` et n'est jamais commité

### Variables requises pour MySQL (production)

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `DB_CONNECTION` | `mysql` (optionnel, déduit automatiquement en production) |
| `DB_HOST` | `localhost` (Hostinger utilise généralement localhost) |
| `DB_PORT` | `3306` (par défaut) |
| `DB_NAME` | Nom de la base MySQL |
| `DB_USER` | Utilisateur MySQL |
| `DB_PASSWORD` | Mot de passe MySQL |
| `NEXTAUTH_SECRET` | Secret pour NextAuth (générer une valeur sécurisée) |
| `NEXTAUTH_URL` | URL publique de l'application (ex. `https://votre-domaine.com`) |

Voir `.env.production.example` à la racine du projet pour un modèle complet.

## Créer la base MySQL (obligatoire avant le premier déploiement)

**Prisma crée les tables, pas la base.** La base MySQL vide doit exister avant `npm run start` :

1. Panneau Hostinger → **Bases de données MySQL**
2. Créer une nouvelle base (ex. `u284690278_makichta`)
3. Créer un utilisateur MySQL avec tous les droits sur cette base
4. Définir `DB_NAME`, `DB_USER`, `DB_PASSWORD` dans les variables d'environnement

## Schéma au démarrage

```
npm install     → postinstall : sélection schéma + prisma generate
npm run build   → next build
npm run start   → prestart : prisma db push (MySQL) ou migrate deploy (SQLite)
                → start : next start
```

- **MySQL** : `prisma db push` crée/met à jour les tables (les migrations sont SQLite, donc on utilise db push pour MySQL)
- **SQLite** : `prisma migrate deploy` applique les migrations
- Si la base n'existe pas ou les identifiants sont incorrects, l'app ne démarre pas

## Après modification des variables

1. **Redémarrer l'application** pour que les nouvelles variables soient prises en compte
2. **Rebuild** si nécessaire : `npm run build` (exécute automatiquement `select-db-schema` puis `prisma generate` avec le bon moteur)
