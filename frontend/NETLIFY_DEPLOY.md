# 🚀 Déploiement Frontend sur Netlify

Ce guide explique comment déployer le frontend Zuwandaku sur Netlify.

---

## ✅ Prérequis

- Compte [Netlify](https://www.netlify.com/)
- Repo GitHub/GitLab/Bitbucket avec ce projet
- Backend déployé (URL connue)

---

## 📁 Fichiers de Configuration Créés

| Fichier | Description |
|---------|-------------|
| `netlify.toml` (racine repo) | Configuration build Netlify (base dir, commande, publish dir, redirects) |
| `frontend/public/_redirects` | Redirections statiques (proxy API + SPA fallback) |
| `frontend/.env.example` | Variables d'environnement requises |

---

## 🔧 Étape 1 : Configurer les Variables d'Environnement sur Netlify

Dans le dashboard Netlify :
**Site settings → Environment variables → Add a variable**

### Variables obligatoires :

```
NEXT_PUBLIC_API_URL=https://zuwandaku-backend-holy-glitter-298.fly.dev/api
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=votre-cle-anon
```

> ⚠️ **Important** : Toute variable préfixée par `NEXT_PUBLIC_` doit être définie AVANT le build.

---

## 🚀 Étape 2 : Connecter le Repo à Netlify

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import an existing project**
3. Choisissez votre fournisseur Git (GitHub)
4. Sélectionnez ce repository
5. Configuration du build :
   - **Base directory** : `frontend`
   - **Build command** : `npm run build`
   - **Publish directory** : `frontend/.next`
6. Cliquez sur **Deploy**

---

## 🔄 Étape 3 : Redirections API

Les appels à `/backend/*` sont automatiquement redirigés vers :
```
https://zuwandaku-backend-holy-glitter-298.fly.dev/api/*
```

Cela est configuré dans :
- `netlify.toml` (redirects)
- `public/_redirects`

---

## 🛠 Dépannage

### Erreur "Module not found"
```bash
npm install --legacy-peer-deps
```

### Images qui ne chargent pas
Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et la config Firebase sont correctes.

### Erreur 404 sur les routes client-side
Les redirects SPA sont configurés dans `public/_redirects`.

---

## 📦 Résumé des Changements

- ✅ `netlify.toml` créé
- ✅ `public/_redirects` créé
- ✅ `.env.example` créé
- ✅ `next.config.mjs` mis à jour (images unoptimized sur Netlify, Firebase hostname ajouté)
- ✅ `vercel.json` supprimé
- ✅ `.vercelignore` supprimé
- ✅ `.vercel/` cache supprimé

---

## 🔗 Liens Utiles

- [Netlify Next.js Runtime](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify Redirects](https://docs.netlify.com/routing/redirects/)

