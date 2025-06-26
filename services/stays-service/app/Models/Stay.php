<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo,
    BelongsToMany,
    HasMany
};

class Stay extends Model
{
    protected $fillable = [
        'host_id',
        'title',
        'description',
        'price_per_night',
        'max_guests',
        'location_id',
        'category_id',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(
            Amenity::class,
            'stay_amenity',
            'stay_id',
            'amenity_id'
        );
    }

    public function media(): HasMany
    {
        return $this->hasMany(Media::class);
    }
}
