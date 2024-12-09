<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Notifications\Notifiable;

class Transaction extends Model
{
    use HasFactory, Notifiable;
    protected $fillable = [
        'transactor',
        'amount',
        'date',
        'fund_id'
    ];

    function fund(): BelongsTo
    {
        return $this->belongsTo(Fund::class);
    }
}
