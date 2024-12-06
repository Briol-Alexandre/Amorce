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
    #[NoReturn]
    public function store(FundStoreRequest $request)
    {
        $fund = new Fund();
        $fund->name = $request->input('name');
        $fund->amount = $request->input('amount', 0);
        $fund->raise = $request->input('raise', 0);
        $fund->save();

        return Inertia::render('Funds');
    }

    public function show(Fund $fund)
    {
        return Inertia::render('Fund', [
            'fund' => $fund,
        ]);
    }
}
