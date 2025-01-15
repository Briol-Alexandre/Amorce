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

        $monthsToCheck = [
            ['month' => $currentMonth - 1, 'year' => $currentYear],
            ['month' => $currentMonth - 2, 'year' => $currentYear],
            ['month' => $currentMonth - 3, 'year' => $currentYear],
        ];

        foreach ($monthsToCheck as &$check) {
            if ($check['month'] <= 0) {
                $check['month'] += 12;
                $check['year'] -= 1;
            }
        }

        $transactions = Transaction::where(function ($query) use ($monthsToCheck) {
            foreach ($monthsToCheck as $check) {
                $query->orWhereMonth('date', $check['month'])
                    ->whereYear('date', $check['year']);
            }
        })->get();

        $transactions->each(function ($transaction) {
            $transaction->date = Carbon::parse($transaction->date);
        });

        $filteredTransactions = $transactions->groupBy('transactor')->filter(function ($userTransactions) use ($monthsToCheck) {
            $monthsWithTransactions = $userTransactions->map(function ($transaction) {
                return $transaction->date->format('Y-m');
            })->unique();

            foreach ($monthsToCheck as $check) {
                $formattedMonth = sprintf('%04d-%02d', $check['year'], $check['month']);
                if (!$monthsWithTransactions->contains($formattedMonth)) {
                    return false;
                }
            }

            return true;
        })->map(function ($userTransactions) {
            return [
                'transactor' => $userTransactions->first()->transactor,
            ];
        })->values();

        return Inertia::render('Detente', [
            'transactions' => $filteredTransactions,
        ]);
    }





}
