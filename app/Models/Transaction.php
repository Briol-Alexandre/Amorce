<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;
use App\Services\CsvManager;

class Transaction extends Model
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'fund_id',
        'transactor',
        'amount',
        'date',
        'communication',
    ];

    function fund(): BelongsTo
    {
        return $this->belongsTo(Fund::class);
    }

    function seedCsvTransaction($filePath): array
    {
        $csvManager = new CsvManager();
        return $csvManager->readCsv($filePath);
    }

}
