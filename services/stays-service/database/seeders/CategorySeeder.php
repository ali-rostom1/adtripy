<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run()
    {
        DB::table('categories')->insert([
            ['id' => 1, 'name' => 'Villa', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'Apartment', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'House', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 4, 'name' => 'Cabin', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 5, 'name' => 'Beach House', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}