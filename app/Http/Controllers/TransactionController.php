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

        return Inertia::render('Transactions/CsvList', [
            'funds' => $funds,
            'transactions' => $transactions,
        ]);
    }


    #[NoReturn] public function storeCsvTransactions(Request $request)
    {
        $transactions = collect($request->input('transactions'))->map(function ($transaction) {
            return [
                'fund_id' => $transaction['fund_id'],
                'amount' => (float) str_replace(',', '.', $transaction['amount']),
                'communication' => $transaction['communication'] ?? 'Aucune communication',
                'transactor' => $transaction['transactor'] ?? 'Transacteur anonyme',
                'date' => Carbon::parse($transaction['date']),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        Transaction::insert($transactions->toArray());

        foreach ($transactions as $transaction) {
            $fund = Fund::find($transaction['fund_id']);
            if ($fund) {
                $fund->amount += $transaction['amount'];
                $fund->save();
            }
        }

        return redirect()->route('fond.index')->with([
            'transactions' => $transactions,
            'funds' => Fund::all(),
        ]);
    }


    public function csvList()
    {
        return Inertia::render('Transactions/CsvList');
    }


    #[NoReturn]
    private function getFundIdForTransaction($data)
    {
        $fund = Fund::where('bank_code', $data['compte_crediteur'])->first()->id;
        return $fund;
    }


    public function index()
    {
        return Inertia::render('Transactions/Csv');

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
