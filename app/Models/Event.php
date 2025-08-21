<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory;

    /**
     * Les attributs qui sont mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'date',
        'time',
        'user_id',
        'file',
    ];

    /**
     * Les attributs qui doivent être castés.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
    ];

    /**
     * Les utilisateurs qui participent à cet événement.
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_user')
            ->withTimestamps();
    }
    
    /**
     * L'utilisateur qui a créé cet événement.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Détermine si l'événement est passé
     */
    public function isPast(): bool
    {
        return $this->date < now()->startOfDay();
    }
    
    /**
     * Détermine si l'utilisateur est le créateur de l'événement
     */
    public function isCreatedBy($user): bool
    {
        return $this->user_id === $user->id;
    }
    
    /**
     * Détermine si un compte rendu peut être ajouté
     */
    public function canAddReport($user): bool
    {
        return $this->isPast() && $this->isCreatedBy($user);
    }
}
