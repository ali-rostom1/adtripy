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
            'create stay',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        
        $unverifiedHost = Role::firstOrCreate(['name' => 'unverified-host']);
        $verifiedHost = Role::firstOrCreate(['name' => 'verified-host']);
        $unverifiedGuest = Role::firstOrCreate(['name' => 'unverified-guest']);
        $verifiedGuest = Role::firstOrCreate(['name' => 'verified-guest']);

        $unverifiedHost->syncPermissions([
            'verify email',
            'verify phone',
            'update password',
            'edit profile'
        ]);
        
        $verifiedHost->syncPermissions([
            'update password',
            'edit profile',
            'manage resources',
            'create stay',
        ]);

        $unverifiedGuest->syncPermissions([
            'verify email',
            'verify phone',
            'update password',
            'edit profile'
        ]);
        
        $verifiedGuest->syncPermissions([
            'update password',
            'edit profile'
        ]);
    }
}
