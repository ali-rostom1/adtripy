<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'user_id',
        'profileable_id',
        'profileable_type',
    ];

    // Relationships
    public function profileable()
    {
        return $this->morphTo();
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
