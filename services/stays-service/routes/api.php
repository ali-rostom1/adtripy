<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StayController;
use Tymon\JWTAuth\Facades\JWTAuth;

// Public routes
Route::get('/stays', [StayController::class, 'index']);
Route::get('/stays/{id}', [StayController::class, 'show']);

// Very important - use your sync middleware BEFORE jwt.auth
Route::middleware(['sync.jwt.user'])->group(function () {
    Route::post('/stays', [StayController::class, 'store']);
    Route::put('/stays/{id}', [StayController::class, 'update']);
    Route::delete('/stays/{id}', [StayController::class, 'destroy']);
    Route::get('/my-stays', [StayController::class, 'myStays']);
});

// Debug endpoint - very helpful for troubleshooting
Route::get('/debug/auth', function() {
    try {
        $token = JWTAuth::parseToken()->getToken();
        $payload = JWTAuth::parseToken()->getPayload()->toArray();
        $userId = $payload['sub'];
        $user = User::find($userId);
        
        return response()->json([
            'token_exists' => !empty($token),
            'payload' => $payload,
            'user_exists' => !empty($user),
            'user' => $user
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage()
        ], 500);
    }
})->middleware('sync.jwt.user');

// Simple test endpoint that doesn't use JWT
Route::get('/ping', function() {
    return response()->json(['message' => 'pong']);
});
