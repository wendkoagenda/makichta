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

## Migrations au démarrage

Sur Business Web Hosting (pas de pipeline Docker, pas de hooks), le flux de déploiement est :

```
npm install     → postinstall : sélection schéma + prisma generate
npm run build   → next build
npm run start   → prestart : prisma migrate deploy (prod uniquement)
                → start : next start
```

- `postinstall` : génère le client Prisma une seule fois (avec le bon schéma sqlite/mysql)
- `prestart` : applique les migrations **uniquement en production** (`NODE_ENV=production`). En local, le script est ignoré
- Le script `migrate-deploy.mjs` construit `DATABASE_URL` à partir des variables `DB_*`, puis lance `prisma migrate deploy` (idempotent, avec verrouillage DB)

- **`prisma migrate deploy`** : applique les migrations en attente (idempotent, verrouillage DB)
- Si les migrations échouent, l'app ne démarre pas (pas de trafic servi avec un schéma obsolète)
- S'il n'y a pas de migration en attente, la commande termine immédiatement

**Important** : Les migrations actuelles ont été créées pour SQLite. Pour MySQL en production, il faut soit générer des migrations compatibles MySQL (`prisma migrate dev` avec `schema.mysql.prisma`), soit initialiser la base MySQL avec `prisma db push` une première fois.

## Après modification des variables

1. **Redémarrer l'application** pour que les nouvelles variables soient prises en compte
2. **Rebuild** si nécessaire : `npm run build` (exécute automatiquement `select-db-schema` puis `prisma generate` avec le bon moteur)
