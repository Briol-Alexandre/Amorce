<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Detente extends Model
{
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
