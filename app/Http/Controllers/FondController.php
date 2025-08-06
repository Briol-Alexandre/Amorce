<?php

namespace App\Http\Controllers;

use App\Http\Requests\FundStoreRequest;
use App\Models\Fund;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use JetBrains\PhpStorm\NoReturn;

class FondController extends Controller
{
    public function index()
    {
        $fonds = Fund::all();
        return Inertia::render('Funds', [
            'funds' => $fonds,
        ]);
    }

    public function store(FundStoreRequest $request)
    {
        $fund = Fund::create($request->validated());
        return Inertia::location(route('fond.show', ['fund' => $fund->id]));
    }


    public function show(Fund $fund)
    {
        $funds = Fund::all();
        $transactions = $fund->transactions()->orderBy('date', 'desc')->get();
        return Inertia::render('Fund', [
            'fund' => $fund,
            'funds' => $funds,
            'transactions' => $transactions,
        ]);
    }

    public function destroy(Fund $fund)
    {
        // Protection des deux fonds principaux (ID 1 et 2)
        if ($fund->id === 1 || $fund->id === 2) {
            return redirect()->route('fond.index')->with('error', 'Impossible de supprimer ce fond principal');
        }
        
        // Protection des fonds marqués comme permanents
        if ($fund->permanent) {
            return redirect()->route('fond.index')->with('error', 'Impossible de supprimer un fond permanent');
        }
        
        $fund->delete();
        return redirect()->route('fond.index')->with('success', 'Fond supprimé avec succès');
    }

    public function update(FundStoreRequest $request, Fund $fund)
    {
        // Protection des deux fonds principaux (ID 1 et 2)
        if ($fund->id === 1 || $fund->id === 2) {
            // Pour les fonds principaux, on ne permet que la modification de la description
            $fund->update([
                'description' => $request->validated()['description']
            ]);
            
            return redirect()->back()->with('success', 'Description du fond principal modifiée avec succès');
        }
        
        // Pour les autres fonds, modification normale
        $fund->update($request->validated());
        
        return redirect()->back()->with('success', 'Fond modifié avec succès');
    }


}
