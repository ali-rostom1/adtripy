<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        // Check if the stays table already exists
        if (Schema::hasTable('stays')) {
            // If it exists, alter it instead of creating it
            Schema::table('stays', function (Blueprint $table) {
                // Add any columns that might be missing from the previous creation
                if (!Schema::hasColumn('stays', 'max_guests')) {
                    $table->unsignedInteger('max_guests')->default(1)->change();
                }
                
                // You can add more column modifications here if needed
            });
        } else {
            // Original table creation if it doesn't exist yet
            Schema::create('stays', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('host_id');
                $table->string('title');
                $table->text('description')->nullable();
                $table->decimal('price_per_night', 8, 2);
                $table->unsignedInteger('max_guests')->default(1);
                $table->foreignId('location_id')->constrained()->cascadeOnDelete();
                $table->foreignId('category_id')->constrained()->cascadeOnDelete();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We should not drop the table here since it might have been created
        // in a different migration. Only drop if we actually created it.
        // For simplicity, we'll leave this empty
    }
};
