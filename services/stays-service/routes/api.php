<?php

use App\Http\Controllers\StayController;

Route::post('/stays', [StayController::class, 'store']);