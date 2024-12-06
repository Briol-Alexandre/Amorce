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
        return Inertia::render('Fund', [
            'fund' => $fund,
            'funds' => $funds
        ]);
    }

    public function destroy(Fund $fund)
    {
        $fund->delete();
        return redirect()->route('fond.index')->with('success', 'Fond supprimé avec succès');
    }

}
