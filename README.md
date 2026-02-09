# Museau & Plume — Site e-commerce premium chiens & chats

Le socle éditorial et visuel existant est conservé. Cette itération ajoute le parcours e-commerce complet : panier, checkout, backend Stripe test et pages de conformité.

## Nouvelles capacités ajoutées
- Panier frontend vanilla JS avec persistance `localStorage`
- Indicateur panier dynamique dans le header (`Panier (x)`)
- Page `cart.html` (quantités, suppression, total)
- Page `checkout.html` avec formulaire client + validation front
- Intégration Stripe Checkout via backend Node/Express
- Page `success.html` post-paiement
- Pages confiance/légalité : `legal.html`, `cgv.html`, `privacy.html`

## Arborescence clé
- Frontend : `*.html`, `styles.css`, `cart.js`, `ui.js`, `checkout.js`
- Backend : `backend/server.js`, `backend/package.json`, `backend/.env.example`

## Lancement local (Stripe test)
1) Installer les dépendances backend
```bash
npm --prefix backend install
```

2) Configurer les clés Stripe
```bash
cp backend/.env.example backend/.env
# puis renseigner STRIPE_SECRET_KEY et STRIPE_PUBLISHABLE_KEY en mode test
```

3) Lancer le backend checkout
```bash
npm --prefix backend start
```

4) Lancer le frontend statique (dans un 2e terminal)
```bash
python -m http.server 8000
```

5) Ouvrir
- Boutique : `http://localhost:8000`
- Checkout : `http://localhost:8000/checkout.html`

## Test de paiement Stripe (mode test)
- Ajouter un produit depuis une page produit
- Ouvrir le panier puis checkout
- Remplir le formulaire et cliquer **Procéder au paiement**
- Utiliser une carte test Stripe (ex. `4242 4242 4242 4242`, date future, CVC libre)
- Vérifier redirection vers `success.html`
