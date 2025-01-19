<?php

namespace App\Http\Controllers;

use App\Http\Requests\DetenteStoreRequest;
use App\Models\Detente;
use App\Models\Donators;
use App\Models\Participations;
use App\Models\Potentials;
use App\Models\Transaction;
use Carbon\Carbon;
use Inertia\Inertia;
use JetBrains\PhpStorm\NoReturn;
use Request;
use function Termwind\render;

class DetenteController extends Controller
{


    #[NoReturn] public function store(DetenteStoreRequest $request)
    {
        $donatorId = $request['donator_id'];


        /*
         * A ajouter dans la méthode update
         * $participation = Detente::query()->increment('participation');
         * $donatorToDelete = Detente::where('participation', 3)->get();


        foreach ($donatorToDelete as $donator) {
            Participations::create([
                'donator_id' => $donator->id,
                'last_detente' => now(),
            ]);
            Detente::where('donator_id', $donator->id)->delete();
        }
        */


        Detente::create($request->validated());

        Potentials::where('donator_id', $donatorId)->delete();

        $potentials = Potentials::all();

        return Inertia::render('Detente', ['transactions' => $potentials]);
    }


    public function getPotentialsDetenteParticipants($excludedDonatorId = null)
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

        $filteredTransactions = $transactions->groupBy('transactor')->filter(function ($userTransactions) use ($monthsToCheck, $excludedDonatorId) {
            $monthsWithTransactions = $userTransactions->map(function ($transaction) {
                return $transaction->date->format('Y-m');
            })->unique();

            foreach ($monthsToCheck as $check) {
                $formattedMonth = sprintf('%04d-%02d', $check['year'], $check['month']);
                if (!$monthsWithTransactions->contains($formattedMonth)) {
                    return false;
                }
            }

            $donator = Donators::where('name', $userTransactions->first()->transactor)->first();
            return $donator && $donator->id != $excludedDonatorId;
        })->map(function ($userTransactions) {
            $donator = Donators::where('name', $userTransactions->first()->transactor)->first();

            return [
                'transactor' => $userTransactions->first()->transactor,
                'donator_id' => $donator ? $donator->id : null,
            ];
        })->values();

        foreach ($filteredTransactions as $potential) {
            $existsInDetente = Detente::where('donator_id', $potential['donator_id'])->exists();
            if (!$existsInDetente) {
                Potentials::firstOrCreate([
                    'name' => $potential['transactor'],
                    'donator_id' => $potential['donator_id'],
                ]);
            }

        }

        return $filteredTransactions;
    }


    #[NoReturn]
    public function index()
    {
        $this->getPotentialsDetenteParticipants();
        $potentials = Potentials::all();
        return Inertia::render('Detente', [
            'transactions' => $potentials,
        ]);
    }


    public function draw()
    {
        $detente = Detente::all();
        return Inertia::render('Draw', [
            'detente' => $detente,
        ]);
    }

    public function destroy(DetenteStoreRequest $request)
    {
        Detente::where($request->validated())->delete();
        $detente = Detente::all();
        return Inertia::render('Draw', [
            'detente' => $detente
        ]);
    }

    #[NoReturn]
    public function participationUpdate()
    {

        $participation = Detente::query()->increment('participation');
        $donatorToDelete = Detente::where('participation', 3)->get();


        foreach ($donatorToDelete as $donator) {
            Participations::create([
                'name' => $donator->name,
                'user_id' => $donator->id,
                'last_detente' => now(),
            ]);
            Detente::where('donator_id', $donator->id)->delete();
        }


    }


}
