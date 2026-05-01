# Guide de déploiement sur Fly.io

## Prérequis
- Compte Fly.io
- CLI Fly installée (`flyctl`)
- Base de données Supabase configurée

## Étape 1: Initialiser l'app Fly.io

À la racine du projet backend:

```bash
fly launch
```

Réponses recommandées:
- App name: zuwandaku-backend (ou accepter la proposition)
- Region: cdg (Paris) ou ams (Amsterdam) - proche de l'Afrique
- Dockerfile: Yes (utiliser le Dockerfile existant)
- Postgres: No (on utilise Supabase)

## Étape 2: Configurer les variables d'environnement

```bash
fly secrets set \
  DATABASE_URL="postgresql://..." \
  JWT_SECRET="ton_secret_jwt" \
  SUPABASE_URL="https://..." \
  SUPABASE_KEY="..." \
  SMTP_HOST="..." \
  SMTP_USER="..." \
  SMTP_PASS="..." \
  FRONTEND_URL="https://ton-frontend.com"
```

Vérifier les variables:
```bash
fly secrets list
```

## Étape 3: Déployer

```bash
fly deploy
```

## Étape 4: Vérifier le déploiement

Récupérer l'URL:
```bash
fly info
```

Tester l'API:
```bash
curl https://zuwandaku-backend.fly.dev/api/health
```

## Étape 5: Monitoring

Voir les logs:
```bash
fly logs
```

## Configuration CORS

Assurez-vous que FRONTEND_URL est correctement configuré dans les secrets Fly.io pour que le CORS fonctionne correctement.

## Bonnes pratiques

- Toujours vérifier les variables d'environnement
- Utiliser les logs pour diagnostiquer les problèmes
- Surveiller l'utilisation des ressources
- Garder les secrets sécurisés (jamais dans Git)
