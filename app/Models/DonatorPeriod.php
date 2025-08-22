<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DonatorPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'donator_id',
        'month',
        'year',
    ];

    /**
     * Obtenir le donateur associé à cette période.
     */
    public function donator(): BelongsTo
    {
        return $this->belongsTo(Donators::class, 'donator_id');
    }
}
