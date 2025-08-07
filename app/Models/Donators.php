<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donators extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
    ];
    
    /**
     * Obtenir les transactions associées à ce donateur.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'donator_id');
    }
}
