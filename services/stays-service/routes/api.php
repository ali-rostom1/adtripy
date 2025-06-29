<?php

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StayController;
use Tymon\JWTAuth\Facades\JWTAuth;

// Public routes
Route::get('/stays', [StayController::class, 'index']);
Route::get('/stays/{id}', [StayController::class, 'show']);
Route::get('/ping', function() { return response()->json(['message' => 'pong']); });

// Endpoints that require user_id from gateway
Route::middleware(['gateway.auth'])->group(function() {
    Route::post('/stays', [StayController::class, 'store']);
    Route::put('/stays/{id}', [StayController::class, 'update']);
    Route::delete('/stays/{id}', [StayController::class, 'destroy']);
    Route::get('/my-stays', [StayController::class, 'myStays']);
});

// Debug endpoint
Route::get('/debug/auth', function() {
    try {
        $token = JWTAuth::parseToken()->getToken();
        $payload = JWTAuth::parseToken()->getPayload()->toArray();
        $userId = $payload['sub'];
        $user = auth()->user() ?: User::find($userId);
        
        return response()->json([
            'token_parsed' => true,
            'payload' => $payload,
            'user_found' => !empty($user),
            'authenticated' => auth()->check(),
            'user' => $user
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
})->middleware('sync.jwt.user');
