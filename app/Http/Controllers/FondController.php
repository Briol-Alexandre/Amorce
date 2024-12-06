<?php

namespace App\Http\Controllers;

use App\Http\Requests\FundStoreRequest;
use App\Models\Fund;
use Inertia\Inertia;
use JetBrains\PhpStorm\NoReturn;

class FondController extends Controller
{
    public function index()
    {
        $fonds = Fund::all();
        return Inertia::render('Fonds', [
            'fonds' => $fonds,
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

        return redirect()->route('fond.index');
    }
}
