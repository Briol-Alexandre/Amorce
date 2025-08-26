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
                'duplicates' => $duplicateCheck['duplicates'],
                'funds' => $funds,
            ]);
        }
        session(['csv_transactions' => $transactions]);

        return redirect()->route('transaction.csv-list');
    }


    public function storeCsvTransactions(Request $request)
    {
        \Log::info('CSV Transactions received:', ['count' => count($request->input('transactions'))]);


        $request->validate([
            'transactions' => 'required|array',
            'transactions.*.fund_id' => 'required|exists:funds,id',
            'transactions.*.amount' => 'required',
            'transactions.*.date' => 'required|date',
        ]);


        $transactions = collect($request->input('transactions'))->map(function ($transaction) {

            $date = \Carbon\Carbon::parse($transaction['date']);

            return [
                'fund_id' => (int) $transaction['fund_id'],
                'amount' => $transaction['amount'],
                'communication' => $transaction['communication'] ?? 'Aucune communication',
                'donator_name' => $transaction['donator_name'] ?? $transaction['transactor'] ?? 'Transacteur anonyme',
                'month' => $date->month,
                'year' => $date->year,
                'date' => $date->toDateString(),
                'email' => $transaction['email'] ?? null,
                'phone' => $transaction['phone'] ?? null,
            ];
        })->toArray();

        \Log::info('Transactions préparées pour le job:', [
            'count' => count($transactions),
            'sample' => !empty($transactions) ? $transactions[0] : 'Aucune transaction'
        ]);


        \App\Jobs\ProcessCsvTransactions::dispatch(
            $transactions,
            auth()->id()
        );


        return redirect()->route('fond.index')->with([
            'success' => 'Votre fichier CSV est en cours de traitement. Les transactions seront ajoutées en arrière-plan.',
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
        $date = Carbon::parse($request->input('date'));
        $month = $date->month;
        $year = $date->year;

        Transaction::create([
            'fund_id' => $fund->id,
            'amount' => $amount,
            'communication' => $request->input('communication'),
            'month' => $month,
            'year' => $year,
        ]);
    }

    public function store(Fund $fund, TransactionStoreRequest $request)
    {
        $validated = $request->validated();

        $donatorName = $validated['transactor'];

        $donator = Donators::firstOrCreate(
            ['name' => $donatorName],
            [
                'name' => $donatorName,
                'email' => $validated['email'] ?? null,
                'phone' => $validated['phone'] ?? null
            ]
        );

        $date = Carbon::parse($validated['date']);
        $month = $date->month;
        $year = $date->year;

        $donatorPeriod = $donator->periods()->firstOrCreate([
            'month' => $month,
            'year' => $year
        ]);

        $transaction = Transaction::create([
            'fund_id' => $validated['fund_id'],
            'amount' => $validated['amount'],
            'month' => $month,
            'year' => $year,
            'communication' => $validated['communication'] ?? 'Don manuel'
        ]);

        $fund->amount += $transaction->amount;
        $fund->save();

        \Log::info('Transaction manuelle créée', [
            'transaction_id' => $transaction->id,
            'donator_id' => $donator->id,
            'donator_name' => $donator->name,
            'period_id' => $donatorPeriod->id,
            'month' => $month,
            'year' => $year,
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

            $amount = str_replace('.', '', $amount);
            $amount = str_replace(',', '.', $amount);
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
     * - Le même mois et année
     * - La même communication
     */
    private function filterDuplicateTransactions($transactions)
    {
        $uniqueTransactions = collect();

        foreach ($transactions as $transaction) {
            $existingTransaction = Transaction::where([
                'fund_id' => $transaction['fund_id'],
                'amount' => $transaction['amount'],
                'month' => $transaction['month'],
                'year' => $transaction['year'],
                'communication' => $transaction['communication'],
            ])->first();

            if (!$existingTransaction) {
                $isDuplicateInBatch = $uniqueTransactions->contains(function ($uniqueTransaction) use ($transaction) {
                    return $uniqueTransaction['fund_id'] == $transaction['fund_id'] &&
                        $uniqueTransaction['amount'] == $transaction['amount'] &&
                        $uniqueTransaction['month'] == $transaction['month'] &&
                        $uniqueTransaction['year'] == $transaction['year'] &&
                        $uniqueTransaction['communication'] == $transaction['communication'];
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


        $transactionsToCheck = [];
        $transactionMap = [];


        foreach ($transactions as $index => $transaction) {
            $fundId = $transaction['fund_id'] ?? $funds[0]->id;
            $amount = (float) $this->parseAmount($transaction['amount']);
            $communication = $transaction['communication'] ?? 'Aucune communication';

            try {
                $date = Carbon::parse($transaction['date']);
                $month = $date->month;
                $year = $date->year;
            } catch (\Exception $e) {
                \Log::warning('Date parsing failed', ['date' => $transaction['date'], 'error' => $e->getMessage()]);
                continue;
            }

            $donatorName = $transaction['donator_name'] ?? 'Transacteur anonyme';
            if (empty(trim($donatorName))) {
                $donatorName = 'Transacteur anonyme';
            }


            $key = "$fundId-$amount-$month-$year-$communication";

            $transactionsToCheck[] = [
                'fund_id' => $fundId,
                'amount' => $amount,
                'month' => $month,
                'year' => $year,
                'communication' => $communication,
                'index' => $index,
                'original' => $transaction,
                'donator_name' => $donatorName,
                'key' => $key
            ];


            $transactionMap[$key] = $index;
        }


        $chunkSize = 50;
        $chunks = array_chunk($transactionsToCheck, $chunkSize);

        foreach ($chunks as $chunkIndex => $chunk) {
            \Log::info('Processing duplicate check chunk', ['chunk' => $chunkIndex + 1, 'size' => count($chunk)]);


            $conditions = [];
            foreach ($chunk as $item) {
                $conditions[] = [
                    'fund_id' => $item['fund_id'],
                    'amount' => $item['amount'],
                    'month' => $item['month'],
                    'year' => $item['year'],
                    'communication' => $item['communication']
                ];
            }


            $query = Transaction::where(function ($query) use ($conditions) {
                foreach ($conditions as $index => $condition) {
                    if ($index === 0) {
                        $query->where($condition);
                    } else {
                        $query->orWhere(function ($q) use ($condition) {
                            foreach ($condition as $field => $value) {
                                $q->where($field, $value);
                            }
                        });
                    }
                }
            });


            $existingTransactions = $query->get();


            foreach ($existingTransactions as $existing) {
                $key = "{$existing->fund_id}-{$existing->amount}-{$existing->month}-{$existing->year}-{$existing->communication}";

                if (isset($transactionMap[$key])) {
                    $originalIndex = $transactionMap[$key];
                    $transaction = $transactionsToCheck[array_search($originalIndex, array_column($transactionsToCheck, 'index'))];

                    $duplicates[] = [
                        'index' => $transaction['index'] + 1,
                        'month' => $transaction['month'],
                        'year' => $transaction['year'],
                        'amount' => $transaction['original']['amount'],
                        'donator_name' => $transaction['donator_name'],
                        'communication' => $transaction['communication'],
                        'existing_id' => $existing->id,
                        'fund_id' => $transaction['fund_id'],
                    ];
                    $duplicateCount++;

                    \Log::info('Duplicate found', [
                        'csv_index' => $transaction['index'] + 1,
                        'existing_id' => $existing->id
                    ]);
                }
            }
        }

        \Log::info('Duplicate check completed', ['duplicates_found' => $duplicateCount]);

        return [
            'hasDuplicates' => $duplicateCount > 0,
            'duplicateCount' => $duplicateCount,
            'duplicates' => $duplicates,
        ];
    }

    /**
     * Récupère la liste des donateurs pour le sélecteur
     */
    public function getDonators()
    {
        $donators = Donators::orderBy('name')->get(['id', 'name', 'email', 'phone']);
        return response()->json($donators);
    }
}
