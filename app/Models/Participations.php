<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Participations extends Model
{
    protected $fillable = [
        'name',
        'user_id',
        'last_detente',
    ];

    function donators(): HasMany
    {
        return $this->hasMany(Donators::class);
    }
}
