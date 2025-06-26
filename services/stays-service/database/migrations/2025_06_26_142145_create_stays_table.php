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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stays');
    }
};
