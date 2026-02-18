# Backlog MVP (priorisé)

## Sprint 0 - Setup technique (fait)

- [x] Initialiser projet `Next.js` + TypeScript
- [x] Installer et configurer `shadcn/ui`
- [x] Créer le store `Redux Toolkit`
- [x] Mettre en place la couche DB (Prisma + SQLite) avec database-schema.md
- [x] Définir le schéma v1 et exécuter la première migration
- [x] Créer le module de paramétrage utilisateur (devise USDT/XOF/EUR/USD, période, conversion API)
- [x] Documenter les conventions de code ([docs/coding-conventions.md](docs/coding-conventions.md))

## Sprint 1 - Noyau budget

### Authentification (fait)

- [x] Inscription, connexion, gestion de session (NextAuth + Credentials + bcrypt)
- [x] Protection des routes (middleware)

### Sources de revenus (paramétrables)

- [ ] CRUD des types de sources de revenus définis par l'utilisateur (ex. : salaire, freelance, prime, allocation, rental, etc.)
- [ ] Chaque source a un libellé personnalisable
- [ ] Fréquence configurable par source :
  - récurrente (mensuelle, hebdomadaire, etc.)
  - ponctuelle (mission freelance, vente, don, etc.)
- [ ] Saisie de chaque revenu : montant, date de perception, source associée
- [ ] Historique des revenus par source et par mois

### Catégories de dépenses

- [ ] CRUD des catégories de dépenses (fixes / variables)
- [ ] Affectation d'un budget mensuel par catégorie (montant prévu)
- [ ] Exemples de catégories par défaut proposées à la création du compte (loyer, alimentation, transport, loisirs, abonnements, assurances)

### Répartition automatique des revenus

- [ ] Paramétrage de pourcentages par poste (épargne, charges fixes, loisirs, investissement, etc.)
- [ ] Calcul automatique des montants alloués à chaque poste dès qu'un revenu est saisi
- [ ] Modification des pourcentages à tout moment avec recalcul immédiat

### Suivi des dépenses

- [ ] Saisie manuelle des dépenses
- [ ] Association obligatoire à une catégorie de dépense
- [ ] Résumé mensuel : total dépenses, comparaison budget prévu vs réel par catégorie
- [ ] Alertes visuelles en cas de dépassement du budget d'une catégorie

## Sprint 2 - Épargne et investissement

### Objectifs d'épargne

- [ ] Création d'objectifs (ex. : fonds d'urgence, voyage, achat immobilier)
- [ ] Paramètres par objectif : montant cible, échéance, priorité
- [ ] Suivi de progression : pourcentage atteint, montant épargné, montant restant
- [ ] Alimentation automatique via la part "épargne" de la répartition des revenus
- [ ] Répartition entre objectifs selon la priorité ou un pourcentage défini

### Investissement

- [ ] Suivi des montants investis par type (actions, crypto, immobilier, autres)
- [ ] Historique des opérations d'investissement (date, montant, type)
- [ ] Vision globale de l'allocation investissement (répartition par type en %)
- [ ] Lien avec les revenus alloués : montant dédié à l'investissement via la répartition

## Sprint 3 - Planification avancée

### Dépenses planifiées

- [ ] Planification de dépenses futures (ponctuelles ou récurrentes)
- [ ] Date prévue et montant estimé
- [ ] Impact automatique sur le budget futur (mois concerné)
- [ ] Marquage "effectuée" quand la dépense est réalisée

### Wishlist financière (backlog d'achats)

- [ ] Liste des achats souhaités à moyen/long terme
- [ ] Par item : libellé, estimation du coût, priorité (haute/moyenne/basse), lien URL optionnel
- [ ] Conversion d'un item wishlist en objectif d'épargne en un clic

### Amortissement des biens

- [ ] Enregistrement d'un bien : libellé, valeur d'achat, durée d'amortissement (en mois ou années), date d'acquisition
- [ ] Calcul automatique de l'amortissement mensuel et annuel (linéaire)
- [ ] Affichage de la valeur résiduelle à date
- [ ] Liste des biens avec statut (en cours / amorti)

## Sprint 4 - Finition produit

### Dashboard consolidé

- [ ] Vue mensuelle : revenus, dépenses totales, épargne réalisée, investissements du mois
- [ ] Vue annuelle : historique mois par mois
- [ ] Graphique camembert : répartition des dépenses par catégorie
- [ ] Graphique courbe : évolution de l'épargne dans le temps
- [ ] Graphique barres : suivi des objectifs d'épargne (atteint vs cible)
- [ ] Indicateurs clés : taux d'épargne, reste à vivre, écart budget

### Paramétrage et personnalisation

- [x] Choix de la devise d'affichage (USDT, XOF, EUR, USD)
- [x] Période de référence (mensuelle par défaut)
- [x] Conversion des montants USDT via API de taux de change
- [ ] Sauvegarde et restauration des données utilisateur

### UX et qualité

- [ ] Terminologie simple et pédagogique dans toute l'interface
- [ ] Accès rapide aux informations clés depuis le dashboard
- [ ] Amélioration des validations et messages d'erreur
- [ ] Documentation utilisateur
- [ ] Documentation technique

## Hors périmètre MVP (v2+)

- Notifications (rappels avant dates prévues)
- Synchronisation bancaire
- Export CSV/PDF
- Multi-comptes
- Application mobile native

## Définition de prêt (Definition of Ready)

- User story claire
- Règles métier validées
- Critères d'acceptation testables

## Définition de fini (Definition of Done)

- Fonctionnel testé manuellement
- Validation des cas d'erreur
- UI cohérente avec design system
- Documentation mise à jour
