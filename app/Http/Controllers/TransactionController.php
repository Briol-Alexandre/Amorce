<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionStoreRequest;
use App\Models\Fund;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;
use JetBrains\PhpStorm\NoReturn;

class TransactionController extends Controller
{

    public function csv(Request $request, Fund $funds)
    {
        $funds = Fund::all();
        $request->validate([
            'csv' => 'required|file|mimes:csv,txt',
        ]);

        $path = $request->file('csv')->getPathname();
        $transactions = (new Transaction)->seedCsvTransaction($path);

        return Inertia::render('Funds', [
            'funds' => $funds,
            'transactions' => $transactions,
        ]);
    }


    #[NoReturn] public function storeCsvTransactions(Request $request)
    {
        dd($request);
    }



    #[NoReturn]
    private function getFundIdForTransaction($data)
    {
        $fund = Fund::where('bank_code', $data['compte_crediteur'])->first()->id;
        return $fund;
    }


    private function create(Fund $fund, float $amount, TransactionStoreRequest $request)
    {
        Transaction::create([
            'fund_id' => $fund->id,
            'amount' => $amount,
            'communication' => $request->input('communication'),
            'transactor' => $request->input('transactor'),
            'date' => $request->input('date'),
        ]);
    }

    #[NoReturn]
    public function store(Fund $fund, TransactionStoreRequest $request)
    {
        $validated = $request->validated();
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
        $this->create($fund, -$amount, $request);
        $this->create($fundDestination, $amount, $request);

        return Inertia::location(route('fond.show', ['fund' => $fund->id]));
    }

}
