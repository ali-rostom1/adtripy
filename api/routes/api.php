<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;



 
Route::get("/", function () {
    return response()->json(['message' => 'test'],201);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/refresh',[AuthController::class,'refresh']);

Route::post('/send-code',[AuthController::class,'sendVerificationCode'])->middleware('auth');
Route::post('/verify-phone',[AuthController::class,'verifyPhone'])->middleware('auth');