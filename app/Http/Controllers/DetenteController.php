<?php

namespace App\Http\Controllers;

use App\Http\Requests\DetenteStoreRequest;
use App\Http\Requests\DetenteRemoveRequest;
use App\Models\{Detente, Donators, Draw, Participations, Permission, Potentials};
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\User;

class DetenteController extends Controller
{
    public function index(Request $request)
    {
        // Rafraîchir la liste des éligibles si demandé
        if ($request->has('refresh')) {
            $this->refreshPotentials();
            return redirect()->route('detente.index')
                ->with('success', 'La liste des donateurs éligibles a été mise à jour.');
        }

        // Préparer les données pour la vue
        $this->ensurePotentialsExist();
        $transactions = $this->getPotentialsWithEligibilityInfo();

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

        // Vérifier si déjà dans le tirage ou dans la détente
        if (Draw::where('donator_id', $data['donator_id'])->exists()) {
            return back()->with('error', "$data[name] est déjà dans la liste des participants au tirage.");
        }

        if (Detente::where('donator_id', $data['donator_id'])->exists()) {
            return back()->with('error', "$data[name] fait déjà partie de la détente actuelle.");
        }

        // Ajouter au tirage et retirer des éligibles
        Draw::create($data);
        $deleted = Potentials::where('donator_id', $data['donator_id'])->delete();

        return redirect()->route('detente.index')
            ->with('success', "$data[name] a été ajouté(e) au tirage. " .
                ($deleted ? 'Supprimé des éligibles.' : 'Attention: non supprimé des éligibles!'))
            ->with('drawParticipantsCount', Draw::count());
    }

    public function remove(DetenteRemoveRequest $request)
    {
        $data = $request->validated();

        if ($data['source'] === 'draw') {
            // Retirer du tirage
            if (Draw::where('donator_id', $data['donator_id'])->exists()) {
                Potentials::create(['name' => $data['name'], 'donator_id' => $data['donator_id']]);
                Draw::where('donator_id', $data['donator_id'])->delete();
                return back()->with('success', "$data[name] a été retiré(e) du tirage et remis(e) parmi les éligibles.");
            }
        } else {
            // Retirer de la détente
            Detente::where('donator_id', $data['donator_id'])->delete();
            return back()->with('success', "$data[name] a été retiré(e) de la détente.");
        }

        return back()->with('error', 'Participant non trouvé.');
    }

    public function destroy(Request $request)
    {
        // Normaliser les données de la requête
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

        // Incrémenter les participations et gérer les sorties
        $removedCount = $this->handleParticipationIncrement();

        // Vérifier les places disponibles
        $availableSpots = 9 - Detente::count();
        if ($availableSpots <= 0) {
            return back()->with('error', 'La détente est toujours complète après rotation. Aucun nouveau participant ne peut être ajouté.');
        }

        // Sélectionner et ajouter les nouveaux participants
        $participantsToSelect = min(3, $availableSpots, Draw::count());
        $selected = Draw::inRandomOrder()->take($participantsToSelect)->get();

        foreach ($selected as $participant) {
            Detente::create([
                'name' => $participant->name,
                'donator_id' => $participant->donator_id,
                'participation' => 1
            ]);
            $user = User::firstOrCreate([
                'name' => $participant->name,
                'email' => null,
                'password' => bcrypt('password'),
            ]);
            
            // Attribuer les permissions de base
            $basicPermissions = Permission::whereIn('slug', ['access-funds', 'access-meetings', 'access-detente', 'access-projects'])->get();
            $user->permissions()->sync($basicPermissions->pluck('id')->toArray());
        }

        // Remettre les non-sélectionnés dans les éligibles
        $this->returnRemainingToEligibles($selected);

        // Vider la liste de tirage
        Draw::truncate();

        // Préparer le message de succès
        $message = $selected->count() . ' participant(s) ajouté(s) à la détente. ';
        if ($removedCount > 0) {
            $message .= $removedCount . ' participant(s) ont quitté la détente après 3 participations. ';
        }
        $message .= 'Les autres ont été remis dans les éligibles.';

        return back()->with('success', $message);
    }

    public function participationUpdate()
    {
        $removedCount = $this->handleParticipationIncrement();
        return back()->with('success', $removedCount . ' participant(s) ont quitté la détente après 3 participations.');
    }

    public function history()
    {
        return Inertia::render('DetenteHistory', [
            'participationsHistory' => Participations::latest('last_detente')->get(),
            'currentDetente' => Detente::orderBy('participation', 'desc')->get(),
            'flash' => session('flash', []),
        ]);
    }

    public function removeAll()
    {
        Draw::truncate();
        Potentials::truncate();
        return back()->with('success', 'Tous les participants ont été supprimés.');
    }

    // Méthodes privées pour simplifier le code

    private function refreshPotentials()
    {
        $this->getPotentialsDetenteParticipants(forceRefresh: true);
    }

    private function ensurePotentialsExist()
    {
        $this->getPotentialsDetenteParticipants();
    }

    private function getPotentialsWithEligibilityInfo()
    {
        $potentials = Potentials::all();
        $lastThreeMonths = collect(range(0, 2))->map(fn($i) => now()->subMonths($i));

        return $potentials->map(function ($potential) use ($lastThreeMonths) {
            $donator = Donators::find($potential->donator_id);

            return [
                'id' => $potential->id,
                'name' => $potential->name,
                'donator_id' => $potential->donator_id,
                'has_recent_donations' => $this->hasRecentDonations($donator, $lastThreeMonths),
                'not_in_detente' => !Detente::where('donator_id', $donator->id)->exists(),
                'last_detente_over_year' => !Participations::where('user_id', $donator->id)
                    ->where('last_detente', '>', now()->subYear())->exists()
            ];
        });
    }

    private function hasRecentDonations($donator, $lastThreeMonths)
    {
        return $lastThreeMonths->every(
            fn($date) => $donator->periods()
                ->where('month', $date->month)
                ->where('year', $date->year)
                ->exists()
        );
    }

    private function handleParticipationIncrement()
    {
        Detente::query()->increment('participation');

        $toRemove = Detente::where('participation', '>', 3)->get();
        foreach ($toRemove as $donator) {
            Participations::create([
                'name' => $donator->name,
                'user_id' => $donator->donator_id,
                'last_detente' => now(),
            ]);
            User::where('name', $donator->name)->delete();

            $donator->delete();
        }

        return $toRemove->count();
    }

    private function returnRemainingToEligibles($selected)
    {
        $remaining = Draw::whereNotIn('id', $selected->pluck('id'))->get();
        foreach ($remaining as $participant) {
            Potentials::create([
                'name' => $participant->name,
                'donator_id' => $participant->donator_id
            ]);
        }
    }

    private function getPotentialsDetenteParticipants($excludedDonatorId = null, $forceRefresh = false)
    {
        if (!$forceRefresh && Potentials::exists())
            return;

        $lastThreeMonths = collect(range(0, 2))->map(fn($i) => now()->subMonths($i));

        $eligible = Donators::all()->filter(function ($donator) use ($lastThreeMonths) {
            // Déjà dans le tirage
            if (Draw::where('donator_id', $donator->id)->exists())
                return false;

            // Vérifier les dons sur les 3 derniers mois
            $donatedAllThreeMonths = $this->hasRecentDonations($donator, $lastThreeMonths);
            if (!$donatedAllThreeMonths)
                return false;

            // Déjà dans la détente
            if (Detente::where('donator_id', $donator->id)->exists())
                return false;

            // A participé à la détente il y a moins d'un an
            return !Participations::where('user_id', $donator->id)
                ->where('last_detente', '>', now()->subYear())->exists();
        });

        if ($forceRefresh)
            Potentials::truncate();

        foreach ($eligible as $donator) {
            Potentials::firstOrCreate(
                ['donator_id' => $donator->id],
                ['name' => $donator->name]
            );
        }
    }
}
