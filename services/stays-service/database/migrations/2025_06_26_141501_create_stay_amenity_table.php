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
        // Create stays table if it doesn't exist
        if (!Schema::hasTable('stays')) {
            Schema::create('stays', function (Blueprint $table) {
                $table->id();
                $table->foreignId('host_id')->comment('User ID from auth service');
                $table->string('title');
                $table->text('description')->nullable();
                $table->decimal('price_per_night', 10, 2);
                $table->integer('max_guests');
                $table->foreignId('location_id')->constrained();
                $table->foreignId('category_id')->constrained();
                $table->timestamps();
            });
        }

        Schema::create('stay_amenity', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stay_id')->constrained('stays')->cascadeOnDelete();
            $table->foreignId('amenity_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stay_amenity');
        // Don't drop stays table here since it may have been created in a different migration
    }
};
