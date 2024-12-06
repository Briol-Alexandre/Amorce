<?php

namespace App\Models;

use Database\Factories\FundFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Fund extends Model
{
    /** @use HasFactory<FundFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'amount',
        'raise',
    ];
}
