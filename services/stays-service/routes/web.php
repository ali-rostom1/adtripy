<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Register API routes with prefix
Route::prefix('api')->group(function() {
    (require __DIR__ . '/api.php')($router = Route::getFacadeRoot());
});
