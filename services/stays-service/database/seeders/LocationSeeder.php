<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    public function run()
    {
        DB::table('locations')->insert([
            [
                'id' => 1, 
                'city' => 'Casablanca', 
                'region' => 'Grand Casablanca',
                'country' => 'Morocco',
                'latitude' => 33.5731,
                'longitude' => -7.5898,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 2, 
                'city' => 'Marrakech', 
                'region' => 'Marrakech-Tensift-Al Haouz',
                'country' => 'Morocco',
                'latitude' => 31.6295,
                'longitude' => -7.9811,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => 3, 
                'city' => 'Tangier', 
                'region' => 'Tangier-Tetouan',
                'country' => 'Morocco',
                'latitude' => 35.7595,
                'longitude' => -5.8340,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}