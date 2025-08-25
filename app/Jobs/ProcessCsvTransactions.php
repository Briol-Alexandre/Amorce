<?php

namespace App\Jobs;

use App\Models\Donators;
use App\Models\Fund;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class ProcessCsvTransactions implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $transactions;
    protected $userId;

    /**
     * Le nombre de tentatives pour ce job
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Le nombre de secondes avant que le job expire
     *
     * @var int
     */
    public $timeout = 600;

    /**
     * Create a new job instance.
     *
     * @param array $transactions
     * @param int $userId
     * @return void
     */
    public function __construct(array $transactions, int $userId)
    {
        $this->transactions = $transactions;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Log::info('Starting CSV transaction processing job', ['transaction_count' => count($this->transactions), 'user_id' => $this->userId]);
        
        $transactions = collect($this->transactions)->map(function ($transaction) {
            $donatorName = $transaction['donator_name'] ?? 'Transacteur anonyme';
            
            if (empty(trim($donatorName))) {
                $donatorName = 'Transacteur anonyme';
            }
            
            $date = Carbon::parse($transaction['date']);
            $month = $date->month;
            $year = $date->year;
            
            return [
                'fund_id' => $transaction['fund_id'],
                'amount' => (float) $this->parseAmount($transaction['amount']),
                'communication' => $transaction['communication'] ?? 'Aucune communication',
                'month' => $month,
                'year' => $year,
                'donator_name' => $donatorName,
                'email' => $transaction['email'] ?? null,
                'phone' => $transaction['phone'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        });
        
        Log::info('Processed transactions', ['count' => $transactions->count()]);
        
        $uniqueTransactions = $this->filterDuplicateTransactions($transactions);
        Log::info('Unique transactions after duplicate check', [
            'original_count' => $transactions->count(), 
            'unique_count' => $uniqueTransactions->count()
        ]);
        
        if ($uniqueTransactions->isEmpty()) {
            Log::warning('No unique transactions found, all are duplicates');
            // Nous pourrions envoyer une notification à l'utilisateur ici
            return;
        }
        
        // Traitement par lots pour éviter les timeouts
        $chunkSize = 10; // Taille du lot
        $processedCount = 0;
        $totalCount = $uniqueTransactions->count();
        
        // Traiter les transactions par lots
        $uniqueTransactions->chunk($chunkSize)->each(function ($chunk) use (&$processedCount, $totalCount) {
            Log::info('Processing chunk', ['chunk_size' => $chunk->count(), 'processed' => $processedCount, 'total' => $totalCount]);
            
            foreach ($chunk as $transaction) {
                $donatorName = $transaction['donator_name'];
                
                $donator = Donators::firstOrCreate(
                    ['name' => $donatorName],
                    [
                        'name' => $donatorName,
                        'email' => $transaction['email'] ?? null,
                        'phone' => $transaction['phone'] ?? null
                    ]
                );
                
                $donatorPeriod = $donator->periods()->firstOrCreate([
                    'month' => $transaction['month'],
                    'year' => $transaction['year']
                ]);
                
                $newTransaction = Transaction::create([
                    'fund_id' => $transaction['fund_id'],
                    'amount' => $transaction['amount'],
                    'month' => $transaction['month'],
                    'year' => $transaction['year'],
                    'communication' => $transaction['communication']
                ]);
                
                Log::debug('Transaction created', [
                    'transaction_id' => $newTransaction->id,
                    'donator_id' => $donator->id,
                    'donator_name' => $donator->name
                ]);
                
                $fund = Fund::find($transaction['fund_id']);
                if ($fund) {
                    $oldAmount = $fund->amount;
                    $fund->amount += $transaction['amount'];
                    $fund->save();
                    Log::debug('Fund updated', ['fund_id' => $fund->id, 'added' => $transaction['amount']]);
                } else {
                    Log::error('Fund not found', ['fund_id' => $transaction['fund_id']]);
                }
                
                $processedCount++;
            }
        });
        
        Log::info('CSV transaction processing completed', [
            'processed_count' => $processedCount,
            'total_count' => $totalCount,
            'user_id' => $this->userId
        ]);
        
        // Nous pourrions envoyer une notification à l'utilisateur ici
    }
    
    /**
     * Parse un montant au format européen (1.234,56) en format standard (1234.56)
     *
     * @param string $amount
     * @return string
     */
    private function parseAmount($amount): string
    {
        if (empty($amount)) return '0';
        
        $amount = trim($amount);
        
        // Format européen avec milliers et décimales
        if (strpos($amount, '.') !== false && strpos($amount, ',') !== false) {
            $amount = str_replace('.', '', $amount); // Supprimer points (milliers)
            $amount = str_replace(',', '.', $amount); // Virgule -> point (décimales)
        } elseif (strpos($amount, ',') !== false) {
            $amount = str_replace(',', '.', $amount); // Simple virgule -> point
        }
        
        return $amount;
    }
    
    /**
     * Filtre les transactions en double
     *
     * @param Collection $transactions
     * @return Collection
     */
    private function filterDuplicateTransactions(Collection $transactions): Collection
    {
        $uniqueTransactions = collect();
        $uniqueKeys = [];
        $chunkSize = 50;
        
        // Traitement par lots pour éviter les timeouts
        foreach ($transactions->chunk($chunkSize) as $chunk) {
            // Créer une liste de clés uniques pour cette partie
            $keys = $chunk->map(function ($transaction) {
                return $transaction['fund_id'] . '|' . 
                       $transaction['amount'] . '|' . 
                       $transaction['month'] . '|' . 
                       $transaction['year'] . '|' . 
                       $transaction['donator_name'];
            })->toArray();
            
            // Vérifier les doublons dans la base de données
            $query = Transaction::query();
            
            foreach ($chunk as $index => $transaction) {
                $query->orWhere(function ($q) use ($transaction) {
                    $q->where('fund_id', $transaction['fund_id'])
                      ->where('amount', $transaction['amount'])
                      ->where('month', $transaction['month'])
                      ->where('year', $transaction['year']);
                });
            }
            
            $existingTransactions = $query->get();
            
            // Filtrer les transactions uniques
            foreach ($chunk as $index => $transaction) {
                $key = $keys[$index];
                
                // Vérifier si c'est un doublon dans la base de données
                $isDuplicateInDb = $existingTransactions->contains(function ($existingTransaction) use ($transaction) {
                    return $existingTransaction->fund_id == $transaction['fund_id'] &&
                           $existingTransaction->amount == $transaction['amount'] &&
                           $existingTransaction->month == $transaction['month'] &&
                           $existingTransaction->year == $transaction['year'];
                });
                
                // Vérifier si c'est un doublon dans le lot actuel
                $isDuplicateInBatch = in_array($key, $uniqueKeys);
                
                if (!$isDuplicateInDb && !$isDuplicateInBatch) {
                    $uniqueTransactions->push($transaction);
                    $uniqueKeys[] = $key;
                }
            }
        }
        
        return $uniqueTransactions;
    }
}
