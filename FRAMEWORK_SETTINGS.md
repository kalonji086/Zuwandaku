# Configuration des Paramètres du Framework pour le Déploiement

Ce document détaille la configuration recommandée pour les Framework Settings de votre projet ZUWAndaku.

## 1. Framework Preset

- **Framework**: Next.js
- **Détection automatique**: Le framework sera automatiquement détecté par votre plateforme de déploiement

## 2. Root Directory

- **Valeur**: `frontend`
- **Explication**: Votre code frontend est situé dans le sous-dossier `frontend`
- **Include files outside the root directory in the Build Step**: Non (désactivé)
- **Skip deployments when there are no changes to the root directory or its dependencies**: Oui (activé)

## 3. Ignored Build Step

- **Behavior**: Automatic
- **Explication**: Laissez la plateforme gérer automatiquement quand lancer un nouveau build

## 4. Node.js Version

- **Version**: 20.x
- **Explication**: Compatible avec votre configuration actuelle (netlify.toml spécifie NODE_VERSION = "20")

## 5. On-Demand Concurrent Builds

- **Option**: Run up to one build per branch
- **Explication**: Les nouveaux déploiements dans une même branche sont mis en file d'attente

## 6. Build Machine

- **Option**: Standard (valeur par défaut)
- **Explication**: Suffisant pour votre projet Next.js de taille moyenne

## 7. Deployment Checks

- **Option**: No checks configured (valeur par défaut)
- **Explication**: Sauf besoins spécifiques de validation avant la mise en production

## 8. Rolling Releases

- **Option**: Désactivé (valeur par défaut)
- **Note**: Cette fonctionnalité nécessite le plan Pro

## 9. Prioritize Production Builds

- **Option**: Enabled (activé)
- **Explication**: Priorise les builds pour l'environnement de production

## Variables d'Environnement Requises

Assurez-vous de configurer les variables d'environnement suivantes dans votre plateforme de déploiement:

```
NEXT_PUBLIC_API_URL=https://zuwandaku-backend.vercel.app/api
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=votre-cle-anon
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
```

## Fichiers de Configuration Existants

- `netlify.toml`: Configuration build Netlify (base dir, commande, publish dir, redirects)
- `vercel.json`: Configuration pour Vercel
- `firebase.json`: Configuration pour Firebase Hosting
- `frontend/next.config.mjs`: Configuration Next.js
- `frontend/public/_redirects`: Redirections statiques (proxy API + SPA fallback)

## Commandes de Build

- **Install**: `npm install --legacy-peer-deps`
- **Build**: `npm run build`
- **Start**: `npm start`

## Notes Importantes

1. Toute variable préfixée par `NEXT_PUBLIC_` doit être définie AVANT le build
2. Les appels à `/backend/*` sont automatiquement redirigés vers `https://zuwandaku-backend.vercel.app/api/*`
3. Le dossier de publication est `frontend/.next`
