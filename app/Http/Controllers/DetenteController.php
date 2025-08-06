<?php

namespace App\Http\Controllers;

use App\Http\Requests\DetenteStoreRequest;
use App\Http\Requests\DetenteRemoveRequest;
use App\Models\{Detente, Donators, Draw, Participations, Potentials, Transaction};
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Request;

class DetenteController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('refresh')) {
            $this->getPotentialsDetenteParticipants(forceRefresh: true);
            return redirect()->route('detente.index')
                ->with('success', 'La liste des donateurs éligibles a été mise à jour.');
        }

        $this->getPotentialsDetenteParticipants();
        
        // Récupérer les potentiels participants
        $potentials = Potentials::all();
        $lastThreeMonths = collect(range(0, 2))->map(fn($i) => now()->subMonths($i));
        
        // Enrichir les données avec les informations dynamiques
        $transactions = $potentials->map(function ($potential) use ($lastThreeMonths) {
            $donator = Donators::find($potential->donator_id);
            
            // Vérifier si le donateur a fait des dons au cours des 3 derniers mois
            $hasRecentDonations = $lastThreeMonths->every(
                fn($date) => 
                Transaction::where('transactor', $donator->name)
                    ->whereMonth('date', $date->month)
                    ->whereYear('date', $date->year)
                    ->exists()
            );
            
            // Vérifier si le donateur ne fait pas partie de la détente actuelle
            $notInDetente = !Detente::where('donator_id', $donator->id)->exists();
            
            // Vérifier si la dernière participation à la détente date de plus d'un an
            $lastDetenteOverYear = !Participations::where('user_id', $donator->id)
                ->where('last_detente', '>', now()->subYear())->exists();
                
            return [
                'id' => $potential->id,
                'name' => $potential->name,
                'donator_id' => $potential->donator_id,
                'has_recent_donations' => $hasRecentDonations,
                'not_in_detente' => $notInDetente,
                'last_detente_over_year' => $lastDetenteOverYear
            ];
        });

        return Inertia::render('Detente', [
            'transactions' => $transactions,
            'drawParticipantsCount' => Draw::count(),
        ]);
    }

    public function draw()
    {
        return Inertia::render('Draw', [
            'drawParticipants' => Draw::all(),
            'detenteParticipants' => Detente::all(),
            'flash' => session('flash', []),
        ]);
    }

    public function store(DetenteStoreRequest $request)
    {
        $data = $request->validated();

        if (Draw::where('donator_id', $data['donator_id'])->exists()) {
            return back()->with('error', "$data[name] est déjà dans la liste des participants au tirage.");
        }

        if (Detente::where('donator_id', $data['donator_id'])->exists()) {
            return back()->with('error', "$data[name] fait déjà partie de la détente actuelle.");
        }

        Draw::create($data);
        $deleted = Potentials::where('donator_id', $data['donator_id'])->delete();

        return redirect()->route('detente.index')
            ->with('success', "$data[name] a été ajouté(e) au tirage. " . ($deleted ? 'Supprimé des éligibles.' : 'Attention: non supprimé des éligibles!'))
            ->with('drawParticipantsCount', Draw::count());
    }

    public function remove(DetenteRemoveRequest $request)
    {
        $data = $request->validated();

        if ($data['source'] === 'draw') {
            if (Draw::where('donator_id', $data['donator_id'])->exists()) {
                Potentials::create(['name' => $data['name'], 'donator_id' => $data['donator_id']]);
                Draw::where('donator_id', $data['donator_id'])->delete();
                return back()->with('success', "$data[name] a été retiré(e) du tirage et remis(e) parmi les éligibles.");
            }
        } else {
            Detente::where('donator_id', $data['donator_id'])->delete();
            return back()->with('success', "$data[name] a été retiré(e) de la détente.");
        }

        return back()->with('error', 'Participant non trouvé.');
    }

    public function destroy(Request $request)
    {
        $data = $request->only(['donator_id', 'name', 'source']);

        if (!$data['donator_id'] || !$data['name'] || !$data['source']) {
            $json = $request->json();
            $data = [
                'donator_id' => $json->get('donator_id'),
                'name' => $json->get('name'),
                'source' => $json->get('source'),
            ];
        }

        return $this->remove(new DetenteRemoveRequest($data));
    }

    public function performDraw()
    {
        if (Draw::count() === 0) {
            return back()->with('error', 'Aucun participant disponible dans le tirage.');
        }

        // Incrémenter les participations des utilisateurs existants dans la détente
        Detente::query()->increment('participation');

        // Vérifier si des participants ont atteint 4 participations et les retirer
        $toRemove = Detente::where('participation', '>', 3)->get();
        foreach ($toRemove as $donator) {
            Participations::create([
                'name' => $donator->name,
                'user_id' => $donator->donator_id,
                'last_detente' => now(),
            ]);

            $donator->delete();
        }

        // Vérifier s'il y a de la place dans la détente APRÈS avoir retiré les participants
        $availableSpots = 9 - Detente::count();
        if ($availableSpots <= 0) {
            return back()->with('error', 'La détente est toujours complète après rotation. Aucun nouveau participant ne peut être ajouté.');
        }

        // Sélectionner les nouveaux participants pour la détente
        $participantsToSelect = min(3, $availableSpots, Draw::count());
        $selected = Draw::inRandomOrder()->take($participantsToSelect)->get();

        foreach ($selected as $participant) {
            Detente::create([
                'name' => $participant->name,
                'donator_id' => $participant->donator_id,
                'participation' => 1 // Initialisation à 1 participation pour les nouveaux
            ]);
        }

        $remaining = Draw::whereNotIn('id', $selected->pluck('id'))->get();
        foreach ($remaining as $participant) {
            Potentials::create([
                'name' => $participant->name,
                'donator_id' => $participant->donator_id
            ]);
        }

        Draw::truncate();

        $message = $selected->count() . ' participant(s) ajouté(s) à la détente. ';
        if ($toRemove->count() > 0) {
            $message .= $toRemove->count() . ' participant(s) ont quitté la détente après 3 participations. ';
        }
        $message .= 'Les autres ont été remis dans les éligibles.';

        return back()->with('success', $message);
    }

    public function participationUpdate()
    {
        Detente::query()->increment('participation');

        $toRemove = Detente::where('participation', '>=', 3)->get();
        foreach ($toRemove as $donator) {
            Participations::create([
                'name' => $donator->name,
                'user_id' => $donator->donator_id,
                'last_detente' => now(),
            ]);

            $donator->delete();
        }

        return back()->with('success', $toRemove->count() . ' participant(s) ont quitté la détente après 3 participations.');
    }

    public function history()
    {
        return Inertia::render('DetenteHistory', [
            'participationsHistory' => Participations::latest('last_detente')->get(),
            'flash' => session('flash', []),
        ]);
    }

    private function getPotentialsDetenteParticipants($excludedDonatorId = null, $forceRefresh = false)
    {
        if (!$forceRefresh && Potentials::exists())
            return;

        $lastThreeMonths = collect(range(0, 2))->map(fn($i) => now()->subMonths($i));
        $eligible = Donators::all()->filter(function ($donator) use ($lastThreeMonths) {
            if (Draw::where('donator_id', $donator->id)->exists())
                return false;

            $donatedAllThreeMonths = $lastThreeMonths->every(
                fn($date) =>
                Transaction::where('transactor', $donator->name)
                    ->whereMonth('date', $date->month)
                    ->whereYear('date', $date->year)
                    ->exists()
            );

            if (!$donatedAllThreeMonths)
                return false;
            if (Detente::where('donator_id', $donator->id)->exists())
                return false;

            return !Participations::where('user_id', $donator->id)
                ->where('last_detente', '>', now()->subYear())->exists();
        });

        if ($forceRefresh)
            Potentials::truncate();

        foreach ($eligible as $donator) {
            Potentials::firstOrCreate([
                'donator_id' => $donator->id
            ], [
                'name' => $donator->name
            ]);
        }
    }
}
