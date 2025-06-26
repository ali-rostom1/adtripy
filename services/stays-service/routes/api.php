<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StayController;



Route::get('/stays', [StayController::class, 'index']);
Route::get('/stays/{id}', [StayController::class, 'show']);
Route::post('/stays', [StayController::class, 'store']);
Route::put('/stays/{id}', [StayController::class, 'update']);
Route::delete('/stays/{id}', [StayController::class, 'destroy']);

Route::get('/ping', function() {
    return response()->json(['message' => 'Stays service is running on port 8001!']);
});
