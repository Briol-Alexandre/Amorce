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


    public function store(DetenteStoreRequest $request)
    {
        $donatorId = $request['donator_id'];

        Detente::create($request->validated());

        Potentials::where('donator_id', $donatorId)->delete();

        $potentials = Potentials::all();

        return Inertia::render('Detente', ['transactions' => $potentials]);
    }


    public function getPotentialsDetenteParticipants($excludedDonatorId = null)
    {
        // 1. Calculer le mois actuel et les 2 mois précédents
        $lastThreeMonths = collect();
        for ($i = 0; $i < 3; $i++) {
            $date = now()->subMonths($i);
            $lastThreeMonths->push([
                'month' => $date->month,
                'year' => $date->year,
                'formatted' => $date->format('Y-m')
            ]);
        }

        // 2. Récupérer tous les donateurs
        $donators = Donators::all();
        $eligibleDonators = collect();

        foreach ($donators as $donator) {
            // Condition 1: A fait un don dans chacun des 3 derniers mois
            $hasDonationsInAllMonths = true;

            foreach ($lastThreeMonths as $monthData) {
                $donationExists = Transaction::where('transactor', $donator->name)
                    ->whereMonth('date', $monthData['month'])
                    ->whereYear('date', $monthData['year'])
                    ->exists();

                if (!$donationExists) {
                    $hasDonationsInAllMonths = false;
                    break;
                }
            }

            if (!$hasDonationsInAllMonths) {
                continue; // Passer au donateur suivant
            }

            // Condition 2: Ne fait pas partie de la détente actuelle
            $isInCurrentDetente = Detente::where('donator_id', $donator->id)->exists();
            if ($isInCurrentDetente) {
                continue; // Passer au donateur suivant
            }

            // Condition 3: N'a pas fait partie d'une détente il y a moins d'un an
            $hasRecentParticipation = Participations::where('user_id', $donator->id)
                ->where('last_detente', '>', now()->subYear())
                ->exists();
            if ($hasRecentParticipation) {
                continue; // Passer au donateur suivant
            }

            // Si toutes les conditions sont remplies, ajouter à la liste des éligibles
            $eligibleDonators->push([
                'transactor' => $donator->name,
                'donator_id' => $donator->id
            ]);
        }

        // Créer ou mettre à jour les potentiels participants
        Potentials::truncate(); // Vider la table des potentiels

        foreach ($eligibleDonators as $eligible) {
            Potentials::create([
                'name' => $eligible['transactor'],
                'donator_id' => $eligible['donator_id']
            ]);
        }

        return $eligibleDonators;
    }


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
