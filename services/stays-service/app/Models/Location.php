<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'latitude',
        'longitude',
    ];

    /**
     * Get the stays for the location.
     */
    public function stays(): HasMany
    {
        return $this->hasMany(Stay::class);
    }
}
