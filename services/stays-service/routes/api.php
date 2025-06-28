<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StayController;



// Public routes (no authentication required)
Route::get('/stays', [StayController::class, 'index']);
Route::get('/stays/{id}', [StayController::class, 'show']);

// Protected routes (authentication required)
Route::middleware('jwt.auth')->group(function () {
    // Stays management
    Route::post('/stays', [StayController::class, 'store']);
    Route::put('/stays/{id}', [StayController::class, 'update']);
    Route::delete('/stays/{id}', [StayController::class, 'destroy']);
    
    // User's own stays
    Route::get('/my-stays', [StayController::class, 'myStays']);
});

// Health check
Route::get('/ping', function() {
    return response()->json(['message' => 'Stays service is running!']);
});
