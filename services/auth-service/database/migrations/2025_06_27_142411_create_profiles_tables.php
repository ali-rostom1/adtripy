<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained('users')->cascadeOnDelete();
            $table->uuidMorphs('profileable'); 
            $table->timestamps();
            
            // Indexes for performance
            $table->index('user_id');
            $table->index(['profileable_id', 'profileable_type']);
        });
        Schema::create('guest_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary(); 
            $table->string('preferred_language', 2)->default('en');
            $table->json('payment_methods')->nullable();
            $table->timestamps();
        });
        Schema::create('host_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary(); 
            $table->string('business_name');
            $table->text('tax_id')->nullable(); // SHOULD be encrypted
            $table->text('bank_account')->nullable(); // SHOULD be encrypted
            $table->enum('verification_status', ['pending', 'verified', 'rejected']);
            $table->timestamps();
            
            // Index for admin verification workflows
            $table->index('verification_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
