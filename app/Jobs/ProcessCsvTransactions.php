<?php

namespace App\Jobs;

use App\Models\Donators;
use App\Models\Fund;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
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
            // S'assurer que le nom du donateur est valide
            $donatorName = $transaction['donator_name'] ?? $transaction['transactor'] ?? 'Transacteur anonyme';
            if (empty(trim($donatorName))) {
                $donatorName = 'Transacteur anonyme';
            }
            
            // S'assurer que la date est correctement parsée
            try {
                $date = Carbon::parse($transaction['date']);
                $month = $date->month;
                $year = $date->year;
            } catch (\Exception $e) {
                Log::error('Erreur de parsing de date', [
                    'date' => $transaction['date'],
                    'error' => $e->getMessage()
                ]);
                // Utiliser la date actuelle comme fallback
                $date = Carbon::now();
                $month = $date->month;
                $year = $date->year;
            }
            
            // S'assurer que le montant est correctement parsé
            $amount = (float) $this->parseAmount($transaction['amount']);
            
            // Utiliser les valeurs month et year déjà calculées si disponibles
            $month = $transaction['month'] ?? $month;
            $year = $transaction['year'] ?? $year;
            
            return [
                'fund_id' => (int) $transaction['fund_id'],
                'amount' => $amount,
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
                try {
                    DB::beginTransaction();
                    
                    $donatorName = $transaction['donator_name'];

                    // S'assurer que le nom du donateur est valide
                    $donatorName = !empty(trim($donatorName)) ? $donatorName : 'Transacteur anonyme';
                    
                    // Créer ou récupérer le donateur
                    $donator = Donators::firstOrCreate(
                        ['name' => $donatorName],
                        [
                            'email' => $transaction['email'],
                            'phone' => $transaction['phone'],
                        ]
                    );
                    
                    Log::info('Donateur traité', [
                        'id' => $donator->id,
                        'name' => $donator->name,
                        'nouveau' => $donator->wasRecentlyCreated ? 'Oui' : 'Non'
                    ]);

                    // Créer ou récupérer la période du donateur
                    $donatorPeriod = $donator->periods()->firstOrCreate([
                        'month' => $transaction['month'],
                        'year' => $transaction['year'],
                    ]);
                    
                    Log::info('Période du donateur traitée', [
                        'id' => $donatorPeriod->id,
                        'donator_id' => $donator->id,
                        'month' => $donatorPeriod->month,
                        'year' => $donatorPeriod->year,
                        'nouveau' => $donatorPeriod->wasRecentlyCreated ? 'Oui' : 'Non'
                    ]);

                    // S'assurer que le montant est correctement parsé
                    $parsedAmount = (float) $this->parseAmount($transaction['amount']);
                    
                    // Créer la transaction
                    $newTransaction = Transaction::create([
                        'fund_id' => (int) $transaction['fund_id'],
                        'amount' => $parsedAmount,
                        'communication' => $transaction['communication'],
                        'month' => (int) $transaction['month'],
                        'year' => (int) $transaction['year'],
                        'donator_period_id' => $donatorPeriod->id, // Lier la transaction à la période du donateur
                    ]);
                    
                    Log::info('Transaction créée', [
                        'id' => $newTransaction->id,
                        'fund_id' => $newTransaction->fund_id,
                        'amount' => $newTransaction->amount,
                        'month' => $newTransaction->month,
                        'year' => $newTransaction->year,
                        'donator_period_id' => $newTransaction->donator_period_id
                    ]);

                    // Mettre à jour le montant du fond
                    $fund = Fund::find((int) $transaction['fund_id']);
                    if ($fund) {
                        $oldAmount = (float) $fund->amount;
                        $fund->amount = $oldAmount + $parsedAmount;
                        $fund->save();
                        
                        Log::info('Fond mis à jour', [
                            'id' => $fund->id,
                            'name' => $fund->name,
                            'ancien_montant' => $oldAmount,
                            'nouveau_montant' => $fund->amount,
                            'différence' => $parsedAmount
                        ]);
                    } else {
                        Log::warning('Fond non trouvé', ['fund_id' => $transaction['fund_id']]);
                    }

                    DB::commit();
                    $processedCount++;

            } catch (\Exception $e) {
                DB::rollBack();
                Log::error('Erreur lors du traitement de la transaction', [
                    'transaction' => $transaction,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
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
        if (empty($amount))
            return '0';

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
        
        Log::info('Début du filtrage des doublons', ['total_transactions' => $transactions->count()]);

        // Traitement par lots pour éviter les timeouts
        foreach ($transactions->chunk($chunkSize) as $chunkIndex => $chunk) {
            Log::info('Traitement du lot ' . ($chunkIndex + 1), ['taille' => $chunk->count()]);
            
            // Préparer les transactions pour la comparaison
            $preparedChunk = $chunk->map(function ($transaction) {
                // S'assurer que le montant est correctement parsé
                $parsedAmount = (float) $this->parseAmount($transaction['amount']);
                
                return [
                    'original' => $transaction,
                    'fund_id' => (int) $transaction['fund_id'],
                    'amount' => $parsedAmount,
                    'month' => (int) $transaction['month'],
                    'year' => (int) $transaction['year'],
                    'key' => (int) $transaction['fund_id'] . '|' .
                           $parsedAmount . '|' .
                           (int) $transaction['month'] . '|' .
                           (int) $transaction['year'] . '|' .
                           $transaction['donator_name']
                ];
            });

            // Vérifier les doublons dans la base de données
            $query = Transaction::query();

            foreach ($preparedChunk as $prepared) {
                $query->orWhere(function ($q) use ($prepared) {
                    $q->where('fund_id', $prepared['fund_id'])
                        ->where('amount', $prepared['amount'])
                        ->where('month', $prepared['month'])
                        ->where('year', $prepared['year']);
                });
            }

            $existingTransactions = $query->get();
            Log::info('Transactions existantes trouvées', ['count' => $existingTransactions->count()]);

            // Filtrer les transactions uniques
            foreach ($preparedChunk as $prepared) {
                $key = $prepared['key'];
                $transaction = $prepared['original'];

                // Vérifier si c'est un doublon dans la base de données
                $isDuplicateInDb = $existingTransactions->contains(function ($existingTransaction) use ($prepared) {
                    return $existingTransaction->fund_id == $prepared['fund_id'] &&
                        (float) $existingTransaction->amount == $prepared['amount'] &&
                        (int) $existingTransaction->month == $prepared['month'] &&
                        (int) $existingTransaction->year == $prepared['year'];
                });

                // Vérifier si c'est un doublon dans le lot actuel
                $isDuplicateInBatch = in_array($key, $uniqueKeys);

                if ($isDuplicateInDb) {
                    Log::info('Transaction ignorée (doublon en DB)', [
                        'fund_id' => $prepared['fund_id'],
                        'amount' => $prepared['amount'],
                        'month' => $prepared['month'],
                        'year' => $prepared['year']
                    ]);
                }
                
                if ($isDuplicateInBatch) {
                    Log::info('Transaction ignorée (doublon dans le lot)', ['key' => $key]);
                }

                if (!$isDuplicateInDb && !$isDuplicateInBatch) {
                    $uniqueTransactions->push($transaction);
                    $uniqueKeys[] = $key;
                    Log::info('Transaction unique ajoutée', [
                        'fund_id' => $prepared['fund_id'],
                        'amount' => $prepared['amount'],
                        'month' => $prepared['month'],
                        'year' => $prepared['year']
                    ]);
                }
            }
        }

        return $uniqueTransactions;
    }
}
