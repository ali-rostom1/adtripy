<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Media extends Model
{
    protected $fillable = [
        'stay_id',
        'url',
        'type',
        'sort_order',
    ];

    public function stay(): BelongsTo
    {
        return $this->belongsTo(Stay::class);
    }
}
