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
        'email',
        'phone',
    ];
    
    /**
     * Obtenir les périodes associées à ce donateur.
     */
    public function periods()
    {
        return $this->hasMany(DonatorPeriod::class, 'donator_id');
    }
}
