<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('hosts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // ID from Auth Service
            $table->string('business_name')->nullable(); // Optional for agencies
            $table->string('phone')->nullable();
            $table->string('contact_email')->nullable();
            $table->text('bio')->nullable();
            $table->json('verification_documents')->nullable(); // ID card, license, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hosts');
    }
};
