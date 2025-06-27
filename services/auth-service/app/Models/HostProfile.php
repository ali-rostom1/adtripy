<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HostProfile extends Model
{
    protected $keyType = 'uuid';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'business_name',
        'tax_id',
        'bank_account',
        'verification_status',
    ];

    protected $casts = [
        'bank_account' => 'encrypted:array',
        'tax_id' => 'encrypted',
        'verification_status' => 'string',
    ];

    // Relationships
    public function profile()
    {
        return $this->morphOne(Profile::class, 'profileable');
    }

    // Business Logic
    public function markAsVerified()
    {
        $this->update(['verification_status' => 'verified']);
    }
}
