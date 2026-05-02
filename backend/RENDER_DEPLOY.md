# Déploiement Backend sur Render

## Prérequis
- Compte [Render](https://render.com)
- Repo GitHub connecté à Render
- Base de données Supabase configurée

## Étapes

### 1. Créer le service
1. Dashboard Render → **New** → **Web Service**
2. Connecter le repo GitHub
3. Sélectionner le dossier `backend/` comme **Root Directory**
4. Render détecte automatiquement le `Dockerfile`

### 2. Variables d'environnement
Dans **Environment** du service, ajouter :

| Variable | Valeur |
|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET` | clé secrète min. 32 chars |
| `FRONTEND_URL` | URL du frontend Netlify |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_ANON_KEY` | clé anon Supabase |
| `MAIL_HOST` | ex: `smtp.gmail.com` |
| `MAIL_PORT` | `587` |
| `MAIL_USER` | adresse email |
| `MAIL_PASS` | mot de passe app |

### 3. Déployer
Cliquer **Create Web Service** — Render build et déploie automatiquement.

### 4. Vérifier
```
GET https://<app>.onrender.com/api/health
```

## Déploiements suivants
Chaque push sur la branche principale déclenche un redéploiement automatique.
