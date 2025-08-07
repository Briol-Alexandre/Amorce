<?php

namespace App\Services;

use League\Csv\Reader;
use League\Csv\Statement;
use League\Csv\Exception;
use App\Models\Fund;

class CsvManager
{
    public function readCsv($filePath): array
    {
        try {
            if (!file_exists($filePath)) {
                throw new \Exception("Le fichier CSV n'existe pas : {$filePath}");
            }

            $csv = Reader::createFromPath($filePath, 'r');
            $csv->setEscape('');
            
            // Détecter si le fichier a un en-tête ou non
            $hasHeader = $this->detectHeader($csv);
            
            if ($hasHeader) {
                $csv->setHeaderOffset(0);
                $stmt = Statement::create()->limit(100);
                $records = $stmt->process($csv);
            } else {
                // Pas d'en-tête, utiliser les indices de colonnes
                $csv->setHeaderOffset(null);
                $stmt = Statement::create()->limit(100);
                $records = $stmt->process($csv);
            }

            $filteredRecords = [];
            foreach ($records as $record) {
                // Gérer les deux cas : avec ou sans en-tête
                if ($hasHeader) {
                    // Avec en-tête, utiliser les noms de colonnes
                    $fondIban = $record['fond'] ?? null;
                    $date = $record['date'] ?? null;
                    $amount = $record['amount'] ?? 0;
                    $compteCreditor = $record['compte_crediteur'] ?? null;
                    $donatorName = $record['transactor'] ?? ''; // Conserver le nom du donateur
                    // Utiliser le numéro de compte comme transactor s'il est disponible, sinon utiliser le nom du transactor
                    $transactor = !empty($compteCreditor) ? $compteCreditor : $donatorName;
                    $communication = $record['communication'] ?? null;
                } else {
                    // Sans en-tête, utiliser les indices (ordre des colonnes)
                    // Ordre: date,fond,amount,compte_crediteur,bic,transactor,adresse,type,communication,solde
                    $fondIban = $record[1] ?? null; // colonne 'fond'
                    $date = $record[0] ?? null; // colonne 'date'
                    $amount = $record[2] ?? 0; // colonne 'amount'
                    $compteCreditor = $record[3] ?? null; // colonne 'compte_crediteur'
                    $donatorName = $record[5] ?? ''; // colonne 'transactor' contient le nom du donateur
                    // Utiliser le numéro de compte comme transactor s'il est disponible, sinon utiliser le nom du transactor
                    $transactor = !empty($compteCreditor) ? $compteCreditor : $donatorName;
                    $communication = $record[8] ?? null; // colonne 'communication'
                }
                
                $fund = null;
                $fundId = null;
                
                // Vérifier si l'IBAN correspond à un fond existant
                if ($fondIban) {
                    $fund = Fund::where('iban', $fondIban)->first();
                    if ($fund) {
                        $fundId = $fund->id;
                    }
                }
                
                $filteredRecords[] = [
                    'date' => $date,
                    'amount' => $amount,
                    'compte_crediteur' => $fondIban,
                    'transactor' => $transactor,
                    'donator_name' => $donatorName, // Ajouter le nom du donateur pour l'enregistrement dans la table donators
                    'communication' => $communication,
                    'fund_id' => $fundId, // Pré-remplir le fund_id si trouvé
                    'fund_name' => $fund ? $fund->name : null, // Ajouter le nom du fond pour l'affichage
                ];
            }

            return $filteredRecords;
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    public function writeCsv($filePath, $data)
    {
    }
    
    /**
     * Détecter si le CSV a un en-tête en vérifiant la première ligne
     */
    private function detectHeader(Reader $csv): bool
    {
        $csv->setHeaderOffset(null); // Reset pour lire la première ligne
        $firstRow = $csv->fetchOne(0);
        
        if (!$firstRow) {
            return false;
        }
        
        // Vérifier si la première ligne contient les noms de colonnes attendus
        $expectedHeaders = ['date', 'fond', 'amount', 'compte_crediteur', 'bic', 'transactor', 'adresse', 'type', 'communication', 'solde'];
        
        // Si la première colonne est 'date', c'est probablement un en-tête
        return isset($firstRow[0]) && $firstRow[0] === 'date';
    }
}
