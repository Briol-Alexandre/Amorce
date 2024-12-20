<?php

namespace App\Models;

use Database\Factories\FundFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;

class Fund extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'iban',
        'description',
        'permanent',
        'amount',
        'raise',
    ];

    function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }



}

