<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Vérification du Déploiement L'Amorce ===\n\n";

$errors = [];
$warnings = [];

// 1. Vérifier la connexion DB
try {
    DB::connection()->getPdo();
    echo "✅ Connexion base de données : OK\n";
} catch (Exception $e) {
    echo "❌ Connexion base de données : ÉCHEC\n";
    $errors[] = "Base de données non accessible : " . $e->getMessage();
}

// 2. Vérifier les tables essentielles
$requiredTables = ['users', 'funds', 'transactions', 'cache', 'migrations'];
foreach ($requiredTables as $table) {
    try {
        DB::table($table)->limit(1)->get();
        echo "✅ Table '$table' : OK\n";
    } catch (Exception $e) {
        echo "❌ Table '$table' : MANQUANTE\n";
        $errors[] = "Table '$table' n'existe pas";
    }
}

// 3. Vérifier les données essentielles
try {
    $userCount = DB::table('users')->count();
    if ($userCount > 0) {
        echo "✅ Utilisateurs : $userCount utilisateur(s)\n";
    } else {
        echo "⚠️  Utilisateurs : Aucun utilisateur\n";
        $warnings[] = "Aucun utilisateur dans la base";
    }
} catch (Exception $e) {
    echo "❌ Vérification utilisateurs : ÉCHEC\n";
    $errors[] = "Impossible de vérifier les utilisateurs";
}

try {
    $fundCount = DB::table('funds')->count();
    if ($fundCount > 0) {
        echo "✅ Fonds : $fundCount fond(s)\n";
        
        // Lister les fonds
        $funds = DB::table('funds')->select('name', 'amount')->get();
        foreach ($funds as $fund) {
            echo "   - {$fund->name} : {$fund->amount}€\n";
        }
    } else {
        echo "⚠️  Fonds : Aucun fond\n";
        $warnings[] = "Aucun fond dans la base";
    }
} catch (Exception $e) {
    echo "❌ Vérification fonds : ÉCHEC\n";
    $errors[] = "Impossible de vérifier les fonds";
}

// 4. Vérifier les migrations
try {
    $migrations = DB::table('migrations')->count();
    echo "✅ Migrations : $migrations migration(s) exécutée(s)\n";
} catch (Exception $e) {
    echo "❌ Vérification migrations : ÉCHEC\n";
    $errors[] = "Impossible de vérifier les migrations";
}

// 5. Vérifier la configuration
echo "\n=== Configuration ===\n";
echo "Environment : " . config('app.env') . "\n";
echo "URL : " . config('app.url') . "\n";
echo "Cache : " . config('cache.default') . "\n";
echo "Session : " . config('session.driver') . "\n";

// Résumé
echo "\n=== RÉSUMÉ ===\n";

if (empty($errors)) {
    echo "🎉 DÉPLOIEMENT RÉUSSI !\n";
    echo "Votre application L'Amorce est prête à être utilisée.\n";
    
    if (!empty($warnings)) {
        echo "\n⚠️  Avertissements :\n";
        foreach ($warnings as $warning) {
            echo "   - $warning\n";
        }
        echo "\nConsidérez exécuter : php artisan db:seed --force\n";
    }
} else {
    echo "❌ DÉPLOIEMENT INCOMPLET\n";
    echo "Les erreurs suivantes doivent être corrigées :\n";
    foreach ($errors as $error) {
        echo "   - $error\n";
    }
    echo "\nActions recommandées :\n";
    echo "   1. php artisan migrate --force\n";
    echo "   2. php artisan db:seed --force\n";
    echo "   3. Relancer cette vérification\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
