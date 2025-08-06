<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Detente extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'donator_id',
        'participation',
    ];

    function donators(): HasMany
    {
        return $this->hasMany(Donators::class);
    }
}
