<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionStoreRequest;
use App\Models\Fund;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use JetBrains\PhpStorm\NoReturn;

class TransactionController extends Controller
{
    #[NoReturn]
    public function store(Fund $fund, TransactionStoreRequest $request)
    {
        // Validation de la requête
        $validated = $request->validated();
        $validated['fund_id'] = $fund->id;

        // Création de la transaction
        $transaction = Transaction::create($validated);

        // Mettre à jour le montant total du fonds (amount)
        $fund->amount += $transaction->amount;
        $fund->save();

        // Rediriger l'utilisateur vers la page du fonds
        return Inertia::location(route('fond.show', ['fund' => $fund->id]));
    }
}
