<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Location extends Model
{
    protected $fillable = [
        'address',
        'city',
        'state',
        'country',
        'latitude',
        'longitude',
    ];

    public function stays(): HasMany
    {
        return $this->hasMany(Stay::class);
    }
}
