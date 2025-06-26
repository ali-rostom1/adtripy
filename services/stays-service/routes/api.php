<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StayController;



Route::apiResource('stays', StayController::class);
