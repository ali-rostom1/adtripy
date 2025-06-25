<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accommodation extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'price_per_night',
        'max_guests',
        'location_id',
        'category_id',
        'amenities',
        'media',
    ];
}