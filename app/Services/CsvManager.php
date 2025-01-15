<?php

namespace App\Services;

use League\Csv\Reader;
use League\Csv\Statement;
use League\Csv\Exception;

class CsvManager
{
    public function readCsv($filePath): array
    {
        try {
            if (!file_exists($filePath)) {
                throw new \Exception("Le fichier CSV n'existe pas : {$filePath}");
            }

            $csv = Reader::createFromPath($filePath, 'r');
            $csv->setHeaderOffset(0);
            $csv->setEscape('');

            $stmt = Statement::create()
                ->offset(10)
                ->limit(100);

            $records = $stmt->process($csv);

            $filteredRecords = [];
            foreach ($records as $record) {
                $filteredRecords[] = [
                    'date' => $record['date'] ?? null,
                    'amount' => $record['amount'] ?? 0,
                    'compte_crediteur' => $record['fond'] ?? null,
                    'transactor' => $record['transactor'] ?? '',
                    'communication' => $record['communication'] ?? null,
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
}
