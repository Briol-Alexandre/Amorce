# Premier Déploiement sur Laravel Cloud - L'Amorce

## 🚨 IMPORTANT : Première Configuration

Votre application nécessite une configuration initiale sur Laravel Cloud. Voici les étapes **obligatoires** :

## Étape 1 : Configurer la Base de Données

1. **Connectez-vous à Laravel Cloud**
2. **Allez dans votre projet "L'Amorce"**
3. **Section "Databases" → "Add Database"**
4. **Choisissez MySQL**
5. **Attendez que le statut soit "Active" (peut prendre quelques minutes)**

## Étape 2 : Première Migration (OBLIGATOIRE)

Une fois la base de données active, vous DEVEZ exécuter manuellement les migrations :

### Via le Terminal Laravel Cloud :

1. **Ouvrez le terminal de votre application**
2. **Exécutez ces commandes dans l'ordre :**

```bash
# Vérifier la connexion
php check-db.php

# Voir le statut des migrations
php artisan migrate:status

# Exécuter les migrations
php artisan migrate --force

# Vérifier que les tables sont créées
php artisan migrate:status

# Seeder la base de données avec vos données
php artisan db:seed --force
```

### Ou utilisez le script automatique :

```bash
./migrate.sh
```

## Étape 3 : Vérification

Après les migrations, votre application devrait :

- ✅ Se charger sans erreur "Table doesn't exist"
- ✅ Avoir les tables : users, funds, transactions, cache, etc.
- ✅ Contenir vos données initiales (Fond Principal, Fond de Fonctionnement)
- ✅ Permettre la connexion avec alexandre.briol@gmail.com / password

## Étape 4 : Déploiements Suivants

Une fois cette configuration initiale faite, les déploiements suivants exécuteront automatiquement :
- Les nouvelles migrations
- Le seeding (si nécessaire)
- La compilation des assets

## 🔍 Diagnostic en Cas de Problème

Si vous avez encore des erreurs, exécutez :

```bash
# Diagnostic complet
php check-db.php

# Voir les tables existantes
php artisan tinker
>>> DB::select('SHOW TABLES');

# Voir le contenu d'une table
>>> DB::table('migrations')->get();
```

## 📞 Points de Contrôle

- [ ] Base de données MySQL créée et active
- [ ] Migrations exécutées (php artisan migrate:status)
- [ ] Tables créées (cache, users, funds, transactions, etc.)
- [ ] Données seedées (Fond Principal visible)
- [ ] Application accessible sans erreur

**Une fois ces étapes complétées, votre application sera pleinement fonctionnelle sur Laravel Cloud !**
