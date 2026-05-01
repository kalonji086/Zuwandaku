# Déploiement sur Railway

Ce guide vous explique comment déployer ce backend NestJS sur Railway.

## Prérequis

- Un compte Railway (https://railway.app/)
- Un dépôt GitHub contenant ce code
- Une base de données PostgreSQL (Railway ou externe)

## Variables d'environnement requises

Configurez ces variables dans les settings de votre projet Railway :

### Base de données
- `DATABASE_URL` - URL de connexion PostgreSQL (ex: `postgresql://user:password@host:port/database`)

### Supabase (optionnel, si utilisé)
- `SUPABASE_URL` - URL de votre projet Supabase
- `SUPABASE_ANON_KEY` - Clé anonyme Supabase

### JWT
- `JWT_SECRET` - Secret pour signer les tokens JWT (important en production)
- `JWT_EXPIRATION` - Durée d'expiration des tokens (défaut: `7d`)

### Application
- `PORT` - Port sur lequel l'application écoute (défaut: `3000`)
- `NODE_ENV` - Environnement (`production` ou `development`)
- `FRONTEND_URL` - URL de votre frontend (pour CORS)

## Déploiement

### Option 1: Via l'interface web Railway

1. Connectez-vous sur https://railway.app/
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Choisissez votre dépôt backend
5. Railway détectera automatiquement la configuration Node.js

### Option 2: Via la CLI Railway

```bash
# Installer la CLI Railway
npm install -g @railway/cli

# Se connecter
railway login

# Initialiser le projet
cd backend
railway init

# Déployer
railway up
```

## Base de données

### Option 1: Base de données Railway

1. Dans votre projet Railway, cliquez sur "New Service"
2. Sélectionnez "Database"
3. Choisissez "PostgreSQL"
4. Railway générera automatiquement le `DATABASE_URL`

### Option 2: Base de données externe

Si vous utilisez une base de données externe (Supabase, etc.) :
1. Ajoutez l'URL de connexion comme variable d'environnement `DATABASE_URL`
2. Railway utilisera cette connexion

## Migrations

Les migrations Prisma s'exécutent automatiquement au déploiement grâce au Dockerfile :
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
```

## Vérification du déploiement

Une fois déployé :
1. Vérifiez les logs dans le dashboard Railway
2. L'URL de votre API sera disponible dans le dashboard
3. Testez l'endpoint de santé (si configuré)

## Dépannage

### Erreur de connexion à la base de données
- Vérifiez que `DATABASE_URL` est correctement configuré
- Assurez-vous que la base de données est accessible

### Erreur de build
- Vérifiez que toutes les dépendances sont dans `package.json`
- Consultez les logs de build dans Railway

### Problèmes CORS
- Configurez `FRONTEND_URL` avec l'URL de votre frontend déployé
- Vérifiez les origines autorisées dans `main.ts`

## Support

Pour plus d'informations :
- Documentation Railway: https://docs.railway.app/
- Documentation NestJS: https://docs.nestjs.com/
- Documentation Prisma: https://www.prisma.io/docs/
