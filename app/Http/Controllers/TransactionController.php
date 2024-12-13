<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionStoreRequest;
use App\Models\Fund;
use App\Models\Transaction;
use Inertia\Inertia;
use JetBrains\PhpStorm\NoReturn;

class TransactionController extends Controller
{
    #[NoReturn]
    public function store(Fund $fund, TransactionStoreRequest $request)
    {
        $validated = $request->validated();
        $validated['fund_id'] = $fund->id;
        $transaction = Transaction::create($validated);

        $fund->amount += $transaction->amount;
        $fund->save();

        return Inertia::location(route('fond.show', ['fund' => $fund->id]));
    }

    #[NoReturn]
    public function update(Fund $fund, TransactionStoreRequest $request)
    {
        $amount = $request->input('amount');
        $fundDestination = Fund::findOrFail($request->input('destinationFundId'));
        $fund->decrement('amount', $amount);
        $fundDestination->increment('amount', $amount);
        $this->createTransaction($fund, -$amount, $request);
        $this->createTransaction($fundDestination, $amount, $request);

        return Inertia::location(route('fond.show', ['fund' => $fund->id]));
    }

    private function createTransaction(Fund $fund, float $amount, TransactionStoreRequest $request)
    {
        Transaction::create([
            'fund_id' => $fund->id,
            'amount' => $amount,
            'communication' => $request->input('communication'),
            'transactor' => $request->input('transactor'),
            'date' => $request->input('date'),
        ]);
    }

}
