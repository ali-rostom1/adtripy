<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\{
    BelongsTo, BelongsToMany, HasMany
};

class Vehicle extends Model
{
    protected $fillable = [
        'host_id',
        'title',
        'description',
        'price_per_day',
        'seats',
        'doors',
        'transmission',
        'fuel_type',
        'vehicle_category_id',
        'location_id',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(VehicleCategory::class, 'vehicle_category_id');
    }

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function features(): BelongsToMany
    {
        return $this->belongsToMany(VehicleFeature::class);
    }

    public function media(): HasMany
    {
        return $this->hasMany(VehicleMedia::class);
    }
}
