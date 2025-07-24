# Configuration Laravel Cloud pour L'Amorce

## Étapes de configuration requises

### 1. Configuration de la base de données

Dans votre tableau de bord Laravel Cloud :

1. **Aller dans votre projet**
2. **Cliquer sur "Databases"**
3. **Ajouter une nouvelle base de données MySQL**
4. **Attendre que la base de données soit provisionnée**

Laravel Cloud configurera automatiquement ces variables d'environnement :
- `DB_CONNECTION=mysql`
- `DB_HOST=...`
- `DB_PORT=3306`
- `DB_DATABASE=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`

### 2. Variables d'environnement recommandées

Ajoutez ces variables dans votre environnement Laravel Cloud :

```env
APP_NAME="L'Amorce"
APP_ENV=production
APP_DEBUG=false
APP_LOCALE=fr
APP_FALLBACK_LOCALE=en

# Cache et Sessions (utiliseront la DB une fois disponible)
CACHE_STORE=database
SESSION_DRIVER=database
CACHE_PREFIX=amorce_cache_

# Queue
QUEUE_CONNECTION=database
```

### 3. Déploiement

Une fois la base de données configurée :

1. **Redéployez votre application**
2. **Les migrations s'exécuteront automatiquement**
3. **La base de données sera seedée avec les données initiales**

### 4. Vérification

Après le déploiement, vérifiez que :
- ✅ L'application se charge sans erreur
- ✅ Vous pouvez vous connecter avec `alexandre.briol@gmail.com` / `password`
- ✅ Les fonds sont visibles dans l'interface

## Dépannage

### Erreur "Connection refused"
- Vérifiez que la base de données MySQL est bien configurée dans Laravel Cloud
- Attendez que le statut de la base de données soit "Active"
- Redéployez l'application après configuration de la DB

### Erreur "Vite manifest not found"
- Vérifiez que Node.js est disponible (fichier `.nvmrc` présent)
- Les assets sont compilés automatiquement via `npm run build`

### Erreur de cache/session
- L'application utilise des fichiers par défaut si la DB n'est pas disponible
- Une fois la DB configurée, elle basculera automatiquement sur la DB

## Scripts utiles

- `./deploy.sh` : Script de déploiement complet
- `./build.sh` : Script de build des assets
- `php check-db.php` : Vérification de la connexion DB
- `./setup-env.sh` : Configuration automatique de l'environnement
