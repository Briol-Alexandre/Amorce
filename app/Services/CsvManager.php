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


            $hasHeader = $this->detectHeader($csv);

            if ($hasHeader) {
                $csv->setHeaderOffset(0);
                $stmt = Statement::create()->limit(100);
                $records = $stmt->process($csv);
            } else {

                $csv->setHeaderOffset(null);
                $stmt = Statement::create()->limit(100);
                $records = $stmt->process($csv);
            }

            $filteredRecords = [];
            foreach ($records as $record) {

                if ($hasHeader) {

                    $fondIban = $record['fond'] ?? null;
                    $date = $record['date'] ?? null;
                    $amount = $record['amount'] ?? 0;
                    $compteCreditor = $record['compte_crediteur'] ?? null;
                    $donatorName = $record['transactor'] ?? '';

                    $transactor = !empty($compteCreditor) ? $compteCreditor : $donatorName;
                    $communication = $record['communication'] ?? null;
                } else {


                    $fondIban = $record[1] ?? null;
                    $date = $record[0] ?? null;
                    $amount = $record[2] ?? 0;
                    $compteCreditor = $record[3] ?? null;
                    $donatorName = $record[5] ?? '';

                    $transactor = !empty($compteCreditor) ? $compteCreditor : $donatorName;
                    $communication = $record[8] ?? null;
                }

                $fund = null;
                $fundId = null;


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
                    'donator_name' => $donatorName,
                    'communication' => $communication,
                    'fund_id' => $fundId,
                    'fund_name' => $fund ? $fund->name : null,
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
        $csv->setHeaderOffset(null);
        $firstRow = $csv->fetchOne(0);

        if (!$firstRow) {
            return false;
        }


        $expectedHeaders = ['date', 'fond', 'amount', 'compte_crediteur', 'bic', 'transactor', 'adresse', 'type', 'communication', 'solde'];


        return isset($firstRow[0]) && $firstRow[0] === 'date';
    }
}
