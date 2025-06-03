<?php

namespace Database\Seeders;

use App\Models\User;
use DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

             // Clear existing users
        DB::table('users')->truncate();
        
       
        $faker = Faker::create();
        
        // Create unverified users (5 users)
        for ($i = 1; $i <= 5; $i++) {
            $birthDate = $faker->dateTimeBetween('-40 years', '-18 years');
            $age = Carbon::parse($birthDate)->age;
            
            User::create([
                'id' => Str::uuid(),
                'firstName' => $faker->firstName(),
                'lastName' => $faker->lastName(),
                'email' => $faker->unique()->safeEmail(), // This generates unique emails
                'password' => Hash::make('password'),
                'phone' => '+21261413' . $faker->randomNumber(4, true), // Add some randomness to phone numbers
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
        
        // Create verified users (5 users)
        for ($i = 1; $i <= 5; $i++) {
            $birthDate = $faker->dateTimeBetween('-40 years', '-18 years');
            $age = Carbon::parse($birthDate)->age;
            $verificationDate = Carbon::now()->subDays($faker->numberBetween(1, 30));
            
            User::create([
                'id' => Str::uuid(),
                'firstName' => $faker->firstName(),
                'lastName' => $faker->lastName(),
                'email' => $faker->unique()->safeEmail(), // This generates unique emails
                'password' => Hash::make('password'),
                'phone' => '+21261413' . $faker->randomNumber(4, true), // Add some randomness to phone numbers
                'birth_date' => $birthDate->format('Y-m-d'),
                'age' => $age,
                'city' => $faker->city(),
                'country' => $faker->country(),
                'last_seen_at' => $faker->optional(0.7)->dateTimeBetween('-7 days', 'now'),
                'pfp_path' => null,
                'email_verified_at' => $verificationDate,
                'phone_verified_at' => $faker->optional(0.5)->dateTimeBetween($verificationDate, 'now'),
            ]);
        }
        
        // Create your personal test account (only if it doesn't exist)
        $personalEmail = 'bensaltanahoussam7@gmail.com';
        if (!User::where('email', $personalEmail)->exists()) {
            User::create([
                'id' => Str::uuid(),
                'firstName' => 'Houssam',
                'lastName' => 'Ben Saltana',
                'email' => $personalEmail,
                'password' => Hash::make('password'),
                'phone' => '+212614137566',
                'birth_date' => '1995-01-01',
                'age' => 28,
                'city' => 'Casablanca',
                'country' => 'Morocco',
                'last_seen_at' => Carbon::now(),
                'pfp_path' => null,
                'email_verified_at' => Carbon::now(), // This account is already verified
                'phone_verified_at' => Carbon::now(),
            ]);
        }
    }
}
