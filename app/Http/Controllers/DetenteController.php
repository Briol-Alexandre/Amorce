<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Carbon\Carbon;
use Inertia\Inertia;
use JetBrains\PhpStorm\NoReturn;

class DetenteController extends Controller
{
    #[NoReturn]
    public function index()
    {
        $currentMonth = now()->month;
        $currentYear = now()->year;

        // Obtenir les mois et années à vérifier
        $monthsToCheck = [
            ['month' => $currentMonth - 1, 'year' => $currentYear],
            ['month' => $currentMonth - 2, 'year' => $currentYear],
            ['month' => $currentMonth - 3, 'year' => $currentYear],
        ];

        // Gérer le passage à l'année précédente si nécessaire
        foreach ($monthsToCheck as &$check) {
            if ($check['month'] <= 0) {
                $check['month'] += 12;
                $check['year'] -= 1;
            }
        }

        // Récupérer toutes les transactions des 3 mois passés
        $transactions = Transaction::where(function ($query) use ($monthsToCheck) {
            foreach ($monthsToCheck as $check) {
                $query->orWhereMonth('date', $check['month'])
                    ->whereYear('date', $check['year']);
            }
        })->get();

        // Convertir la colonne 'date' en instance de Carbon
        $transactions->each(function ($transaction) {
            $transaction->date = Carbon::parse($transaction->date);
        });

        // Filtrer les utilisateurs qui ont des transactions dans les 3 mois
        $filteredTransactions = $transactions->groupBy('transactor')->map(function ($userTransactions) {
            return [
                'transactor' => $userTransactions->first()->transactor, // Nom de l'utilisateur
                'amount' => $userTransactions->sum('amount'), // Somme des montants
                'date' => $userTransactions->last()->date, // Dernière date
            ];
        })->values();

        return Inertia::render('Detente', [
            'transactions' => $filteredTransactions, // Renvoyer une liste aplatie
        ]);
    }




}
