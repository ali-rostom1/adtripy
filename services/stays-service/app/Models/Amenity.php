<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Amenity extends Model
{
    protected $fillable = [
        'name',
    ];

    public function stays(): BelongsToMany
    {
        return $this->belongsToMany(
            Stay::class,
            'stay_amenity',
            'amenity_id',
            'stay_id'
        );
    }
}
