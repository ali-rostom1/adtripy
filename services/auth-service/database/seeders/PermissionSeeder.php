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
        Role::create(['name' => 'guest']);
        Role::create(['name' => 'host']);
        Role::create(['name' => 'admin']);
        $guestPermissions = [
            'bookings.create',
            'bookings.cancel_own',
            'reviews.create',
            'payments.make_payment'
        ];
        $hostPermissions = [
            'properties.manage_own',
            'bookings.manage_own',
            'payouts.view_earnings',
            'calendar.update_availability'
        ];
        $adminPermissions = [
            'users.manage',
            'properties.manage_all',
            'bookings.manage_all',
            'reports.view',
            'settings.update'
        ];
        foreach ($guestPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        foreach ($hostPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
        foreach ($adminPermissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign permissions to roles
        $guestRole = Role::findByName('guest');
        $hostRole = Role::findByName('host');
        $adminRole = Role::findByName('admin');
        $guestRole->syncPermissions($guestPermissions);
        $hostRole->syncPermissions($hostPermissions);
        $adminRole->syncPermissions($adminPermissions);
        
    }
}
