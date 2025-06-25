<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $permissions = [
            'verify email', 
            'verify phone',
            'update password',
            'edit profile',
            'manage resources',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
        $unverifiedHost = Role::create(['name' => 'unverified-host']);
        $verifiedHost = Role::create(['name' => 'verified-host']);

        $unverifiedHost->givePermissionTo([
            'verify email' , 'verify phone','update password', 'edit profile'
        ]);
        $verifiedHost->givePermissionTo([
            'update password', 'edit profile','manage resources',
        ]);

        $unverifiedGuest = Role::create(['name' => 'unverified-guest']);
        $verifiedGuest = Role::create(['name' => 'verified-guest']);


        $unverifiedGuest->givePermissionTo([
            'verify email' , 'verify phone','update password', 'edit profile'
        ]);
        $verifiedGuest->givePermissionTo([
            'update password', 'edit profile'
        ]);
    }
}
