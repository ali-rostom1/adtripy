<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestProfile extends Model
{
    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'preferred_language',
        'payment_methods',
    ];

    protected $casts = [
        'payment_methods' => 'array',
    ];

    // Relationships
    public function profiles()
    {
        return $this->morphOne(Profile::class, 'profileable');
    }
}
