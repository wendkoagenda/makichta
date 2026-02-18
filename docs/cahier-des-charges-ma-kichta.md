# Cahier des charges – Application de gestion des finances personnelles (Ma kichta)

## 1. Contexte et objectifs

L’application a pour objectif d’aider l’utilisateur à **gérer efficacement ses finances personnelles** en mettant l’accent sur :

- l’**épargne avec des objectifs à atteindre**,
- l’**investissement**,
- la **planification des dépenses et des achats futurs**,
- la **répartition automatique des revenus** selon des pourcentages définis,
- le **suivi précis des dépenses mensuelles**, fixes et variables.

L’application doit être simple, pédagogique et orientée prise de décision.

---

## 2. Périmètre fonctionnel

### 2.1 Gestion des revenus

- Saisie manuelle des revenus (salaire, revenus annexes, autres).
- Fréquence : mensuelle, ponctuelle ou récurrente.
- Date de perception du revenu.

### 2.2 Répartition automatique des revenus

- Paramétrage de **pourcentages par poste de dépense** (ex. : épargne, charges fixes, loisirs, investissement).
- Calcul automatique des montants alloués à chaque poste.
- Possibilité de modifier les pourcentages à tout moment.

### 2.3 Gestion des postes de dépenses

- Création, modification et suppression de postes de dépenses.
- Catégorisation :
  - dépenses fixes (loyer, abonnements, assurances),
  - dépenses variables (alimentation, transport, loisirs).

- Affectation d’un budget mensuel par poste.

### 2.4 Suivi des dépenses

- Saisie des dépenses manuelles.
- Association obligatoire à un poste de dépense.
- Suivi mensuel avec :
  - total des dépenses,
  - comparaison budget prévu / réel,
  - alertes en cas de dépassement.

### 2.5 Épargne avec objectifs

- Création d’objectifs d’épargne (ex. : fonds d’urgence, voyage, achat immobilier).
- Définition :
  - montant cible,
  - échéance,
  - priorité.

- Suivi de la progression (% atteint, montant restant).
- Alimentation automatique via la répartition des revenus.

### 2.6 Investissement

- Suivi des montants investis par type (ex. : actions, crypto, immobilier, autres).
- Historique des investissements.
- Vision globale de l’allocation investissement.
- Lien avec les revenus alloués à l’investissement.

### 2.7 Dépenses et achats planifiés

- Planification de dépenses futures (ponctuelles ou récurrentes).
- Impact automatique sur le budget futur.
- Notifications avant la date prévue.

### 2.8 Backlog d’achats (wishlist financière)

- Liste des achats souhaités à moyen ou long terme.
- Estimation du coût.
- Priorisation des achats.
- Possibilité de transformer un élément du backlog en objectif d’épargne.

### 2.9 Amortissement des biens

- Enregistrement des biens (voiture, matériel, équipement, etc.).
- Paramètres :
  - valeur d’achat,
  - durée d’amortissement,
  - date d’acquisition.

- Calcul automatique de l’amortissement mensuel et annuel.
- Vision de la valeur résiduelle.

---

## 3. Tableaux de bord et reporting

- Tableau de bord mensuel avec :
  - revenus,
  - dépenses totales,
  - épargne réalisée,
  - investissements.

- Graphiques :
  - répartition des dépenses,
  - évolution de l’épargne,
  - suivi des objectifs.

- Historique mensuel et annuel.

---

## 4. Paramétrage et personnalisation

- Devise.
- Période de référence (mensuelle par défaut).
- Pourcentages de répartition modifiables.
- Activation/désactivation de modules (investissement, amortissement, backlog).

---

## 5. Exigences non fonctionnelles

### 5.1 Ergonomie et UX

- Interface claire et intuitive.
- Terminologie simple et compréhensible.
- Accès rapide aux informations clés.

### 5.2 Sécurité

- Authentification utilisateur.
- Protection des données personnelles.
- Sauvegarde des données.

### 5.3 Performance

- Calculs instantanés.
- Temps de réponse rapide, même avec plusieurs années de données.

### 5.4 Évolutivité

- Architecture permettant l’ajout futur de :
  - synchronisation bancaire,
  - export des données,
  - multi-comptes.

---

## 6. Cibles utilisateurs

- Particuliers souhaitant mieux gérer leur budget.
- Personnes orientées épargne et investissement.
- Utilisateurs recherchant une vision long terme de leurs finances.

---

## 7. Livrables attendus

- Application web et/ou mobile.
- Documentation utilisateur.
- Documentation technique.

---

## 8. Critères de succès

- L’utilisateur comprend clairement où va son argent.
- Atteinte progressive des objectifs d’épargne.
- Réduction des dépenses non maîtrisées.
- Vision financière claire à court, moyen et long terme.
