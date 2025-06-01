<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        

        // Create unverified users
        for ($i = 1; $i <= 10; $i++) {
            $birthDate = $faker->dateTimeBetween('-40 years', '-18 years');
            $age = \Carbon\Carbon::parse($birthDate)->age;
            
            User::create([
                'id' => Str::uuid(),
                'firstName' => $faker->firstName(),
                'lastName' => $faker->lastName(),
                'email' => $faker->unique()->safeEmail(),
                'password' => Hash::make('password'),
                'phone' => '+212614137566',
                'birth_date' => $birthDate->format('Y-m-d'),
                'age' => $age,
                'city' => $faker->city(),
                'country' => $faker->country(),
                'last_seen_at' => null,
                'pfp_path' => null,
                'email_verified_at' => null,
                'phone_verified_at' => null,
            ]);
        }
    }
}
