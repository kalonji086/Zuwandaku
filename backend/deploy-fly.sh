#!/bin/bash

# Script pour redéployer le backend sur Fly.io

echo "🚀 Début du déploiement sur Fly.io..."

# Vérifier si Fly CLI est installé
if ! command -v fly &> /dev/null
then
    echo "❌ Fly CLI n'est pas installé. Veuillez l'installer depuis https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Construire l'application
echo "📦 Construction de l'application..."
npm run build

# Déployer sur Fly.io
echo "🚀 Déploiement sur Fly.io..."
fly deploy

echo "✅ Déploiement terminé avec succès !"
echo "🌐 Votre backend est accessible à l'adresse : https://zuwandaku-backend.fly.dev"
