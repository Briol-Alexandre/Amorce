<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionStoreRequest;
use App\Models\Donators;
use App\Models\Fund;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\In;
use Inertia\Inertia;

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

        $duplicateCheck = $this->checkForDuplicatesInCsv($transactions, $funds);

        if ($duplicateCheck['hasDuplicates']) {
            return Inertia::render('Transactions/CsvError', [
                'error' => 'Doublons détectés dans le CSV',
                'message' => "Ce CSV contient {$duplicateCheck['duplicateCount']} transactions qui existent déjà en base de données. Import bloqué pour éviter la duplication d'argent.",
                'duplicates' => $duplicateCheck['duplicates'],
                'totalTransactions' => count($transactions),
            ]);
        }

        session(['csv_transactions' => $transactions]);

        return redirect()->route('transaction.csv-list');
    }


    public function storeCsvTransactions(Request $request)
    {
        \Log::info('CSV Transactions received:', $request->input('transactions'));

        $transactions = collect($request->input('transactions'))->map(function ($transaction) {
            $donatorName = $transaction['donator_name'] ?? 'Transacteur anonyme';

            if (empty(trim($donatorName))) {
                $donatorName = 'Transacteur anonyme';
            }

            $donator = Donators::firstOrCreate(
                ['name' => $donatorName],
                ['name' => $donatorName]
            );

            return [
                'fund_id' => $transaction['fund_id'],
                'amount' => (float) $this->parseAmount($transaction['amount']),
                'communication' => $transaction['communication'] ?? 'Aucune communication',
                'transactor' => $transaction['transactor'] ?? 'Transacteur anonyme',
                'date' => Carbon::parse($transaction['date']),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });

        \Log::info('Processed transactions:', $transactions->toArray());

        $uniqueTransactions = $this->filterDuplicateTransactions($transactions);
        \Log::info('Unique transactions after duplicate check:', ['original_count' => $transactions->count(), 'unique_count' => $uniqueTransactions->count()]);

        if ($uniqueTransactions->isEmpty()) {
            return redirect()->route('fond.index')->with([
                'error' => 'Toutes les transactions sont des doublons. Aucune transaction n\'a été ajoutée.',
                'funds' => Fund::all(),
            ]);
        }

        foreach ($uniqueTransactions as $transaction) {
            $donatorName = collect($request->input('transactions'))
                ->firstWhere('transactor', $transaction['transactor'])['donator_name'] ?? 'Transacteur anonyme';

            if (empty(trim($donatorName))) {
                $donatorName = 'Transacteur anonyme';
            }

            $donator = Donators::firstOrCreate(['name' => $donatorName]);

            $newTransaction = Transaction::create([
                'fund_id' => $transaction['fund_id'],
                'amount' => $transaction['amount'],
                'date' => $transaction['date'],
                'communication' => $transaction['communication'],
                'transactor' => $transaction['transactor'],
                'donator_id' => $donator->id
            ]);

            \Log::info('Transaction created and linked to donator:', [
                'transaction_id' => $newTransaction->id,
                'donator_id' => $donator->id,
                'donator_name' => $donator->name,
                'transactor' => $transaction['transactor']
            ]);

            $fund = Fund::find($transaction['fund_id']);
            if ($fund) {
                $oldAmount = $fund->amount;
                $fund->amount += $transaction['amount'];
                $fund->save();
                \Log::info('Fund updated:', ['fund_id' => $fund->id, 'old_amount' => $oldAmount, 'new_amount' => $fund->amount, 'added' => $transaction['amount']]);
            } else {
                \Log::error('Fund not found:', ['fund_id' => $transaction['fund_id']]);
            }
        }

        $duplicatesCount = $transactions->count() - $uniqueTransactions->count();

        return redirect()->route('fond.index')->with([
            'success' => $duplicatesCount > 0
                ? "Import réussi ! {$uniqueTransactions->count()} transactions ajoutées, {$duplicatesCount} doublons ignorés."
                : "Import réussi ! {$uniqueTransactions->count()} transactions ajoutées.",
            'transactions' => $uniqueTransactions,
            'funds' => Fund::all(),
        ]);
    }



    public function csvList()
    {
        $transactions = session('csv_transactions', []);
        $funds = Fund::all();

        session()->forget('csv_transactions');

        return Inertia::render('Transactions/CsvList', [
            'funds' => $funds,
            'transactions' => $transactions,
        ]);
    }


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

    public function store(Fund $fund, TransactionStoreRequest $request)
    {
        $validated = $request->validated();

        $donatorName = $validated['transactor'];

        $donator = Donators::firstOrCreate(
            ['name' => $donatorName],
            ['name' => $donatorName]
        );

        $validated['transactor'] = "Don d'argent en liquide";

        $validated['donator_id'] = $donator->id;

        $transaction = Transaction::create($validated);

        $fund->amount += $transaction->amount;
        $fund->save();

        \Log::info('Transaction manuelle créée', [
            'transaction_id' => $transaction->id,
            'donator_id' => $donator->id,
            'donator_name' => $donator->name,
            'transactor' => $transaction->transactor,
            'amount' => $transaction->amount
        ]);

        return Inertia::location(route('fond.show', ['fund' => $fund->id]));
    }


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

    /**
     * Parse les montants européens (ex: "2.580,00" -> 2580.00)
     */
    private function parseAmount($amount): string
    {
        if (empty($amount)) {
            return '0';
        }

        $amount = trim($amount);

        if (strpos($amount, '.') !== false && strpos($amount, ',') !== false) {


        } elseif (strpos($amount, ',') !== false) {
            $amount = str_replace(',', '.', $amount);
        }

        return $amount;
    }

    /**
     * Filtrer les transactions en double en vérifiant l'unicité
     * Une transaction est considérée comme un doublon si elle a :
     * - Le même fund_id
     * - Le même montant
     * - La même date
     * - Le même transacteur
     */
    private function filterDuplicateTransactions($transactions)
    {
        $uniqueTransactions = collect();

        foreach ($transactions as $transaction) {
            $existingTransaction = Transaction::where([
                'fund_id' => $transaction['fund_id'],
                'amount' => $transaction['amount'],
                'date' => $transaction['date'],
                'transactor' => $transaction['transactor'],
            ])->first();

            if (!$existingTransaction) {
                $isDuplicateInBatch = $uniqueTransactions->contains(function ($uniqueTransaction) use ($transaction) {
                    return $uniqueTransaction['fund_id'] == $transaction['fund_id'] &&
                        $uniqueTransaction['amount'] == $transaction['amount'] &&
                        $uniqueTransaction['date'] == $transaction['date'] &&
                        $uniqueTransaction['transactor'] == $transaction['transactor'];
                });

                if (!$isDuplicateInBatch) {
                    $uniqueTransactions->push($transaction);
                    \Log::info('Transaction added as unique:', $transaction);
                } else {
                    \Log::warning('Duplicate transaction found in current batch:', $transaction);
                }
            } else {
                \Log::warning('Duplicate transaction found in database:', ['transaction' => $transaction, 'existing_id' => $existingTransaction->id]);
            }
        }

        return $uniqueTransactions;
    }

    /**
     * Vérifier les doublons dans le CSV dès l'upload
     */
    private function checkForDuplicatesInCsv($transactions, $funds)
    {
        $duplicates = [];
        $duplicateCount = 0;

        \Log::info('Starting duplicate check', ['transaction_count' => count($transactions), 'funds_count' => $funds->count()]);

        foreach ($transactions as $index => $transaction) {
            $fundId = $transaction['fund_id'] ?? $funds[0]->id;
            $amount = (float) $this->parseAmount($transaction['amount']);

            $donatorName = $transaction['transactor'] ?? 'Transacteur anonyme';
            if (empty(trim($donatorName))) {
                $donatorName = 'Transacteur anonyme';
            }
            $transactor = $donatorName;
            $communication = $transaction['communication'] ?? 'Aucune communication';

            try {
                $date = Carbon::parse($transaction['date']);
            } catch (\Exception $e) {
                \Log::warning('Date parsing failed', ['date' => $transaction['date'], 'error' => $e->getMessage()]);
                continue;
            }

            \Log::debug('Checking transaction', [
                'index' => $index + 1,
                'fund_id' => $fundId,
                'amount' => $amount,
                'date' => $date->format('Y-m-d'),
                'transactor' => $transactor
            ]);

            $existingTransaction = Transaction::where([
                'fund_id' => $fundId,
                'amount' => $amount,
                'date' => $date,
                'transactor' => $transactor,
            ])->first();

            if ($existingTransaction) {
                \Log::info('Duplicate found', [
                    'csv_index' => $index + 1,
                    'existing_id' => $existingTransaction->id,
                    'amount' => $amount,
                    'date' => $date->format('Y-m-d')
                ]);

                $duplicates[] = [
                    'index' => $index + 1,
                    'date' => $transaction['date'],
                    'amount' => $transaction['amount'],
                    'transactor' => $transactor,
                    'communication' => $communication,
                    'existing_id' => $existingTransaction->id,
                    'fund_id' => $fundId,
                ];
                $duplicateCount++;
            } else {
                \Log::debug('No duplicate found for transaction', ['index' => $index + 1]);
            }
        }

        \Log::info('Duplicate check completed', ['duplicates_found' => $duplicateCount]);

        return [
            'hasDuplicates' => $duplicateCount > 0,
            'duplicateCount' => $duplicateCount,
            'duplicates' => $duplicates,
        ];
    }

}
