# PWA – Ma Kichta

## Clarification

Tu visais **PWA** (Progressive Web App), pas SPA. Une PWA permet notamment :

- **Installation** sur l’écran d’accueil (mobile ou desktop)
- **Affichage en mode app** (sans barre d’URL du navigateur)
- **Thème et icône** reconnus par l’OS
- Optionnel : **cache / fonctionnement offline** via un service worker

L’app Next.js actuelle n’a pas encore de manifeste ni de service worker. Ce document décrit comment ajouter le minimum pour une PWA installable.

---

## 1. Manifeste web (obligatoire pour PWA)

Créer **public/manifest.json** (ou **src/app/manifest.ts** avec la Metadata API Next.js) avec :

- `name` : "Ma Kichta"
- `short_name` : "Ma Kichta"
- `description` : "Gestion des finances personnelles"
- `start_url` : "/" ou "/dashboard"
- `display` : "standalone"
- `theme_color` et `background_color`
- `icons` : au moins 192x192 et 512x512 (PNG dans public/)

Lier le manifest dans **src/app/layout.tsx** : `metadata.manifest = "/manifest.json"` ou `<link rel="manifest" href="/manifest.json" />`.

---

## 2. Icônes PWA

- Ajouter dans **public/** : **icon-192.png** (192x192) et **icon-512.png** (512x512).
- Les générer à partir du logo existant (ex. logo_mk-no-bg.png) avec un outil en ligne ou script.

---

## 3. Service worker (optionnel)

- Sans SW : l’app est déjà **installable**.
- Avec SW (next-pwa ou custom) : cache et meilleur offline. À ajouter dans un second temps si besoin.

---

## 4. Fichiers à créer / modifier

| Fichier | Action |
|--------|--------|
| public/manifest.json (ou app/manifest.ts) | Créer le manifest |
| public/icon-192.png, public/icon-512.png | Ajouter les icônes |
| src/app/layout.tsx | Référencer le manifest |

---

## 5. Test

Tester en local (localhost) ou en HTTPS : menu navigateur > "Installer l’application" / "Add to Home Screen".
