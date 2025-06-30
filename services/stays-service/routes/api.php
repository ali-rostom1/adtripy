<?php
// filepath: c:\laragon\www\adtripy\services\stays-service\routes\api.php

use App\Http\Controllers\StayController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AmenityController;
use Illuminate\Http\Request;

// Don't use Route facade directly
return function ($router) {
    // Public routes
    $router->get('/stays', [StayController::class, 'index']);
    $router->get('/stays/{id}', [StayController::class, 'show']);
    $router->get('/ping', function() { 
        return response()->json(['message' => 'pong']); 
    });
    $router->get('/categories', [CategoryController::class, 'index']);
    $router->get('/categories/{id}', [CategoryController::class, 'show']);
    $router->get('/amenities', [AmenityController::class, 'index']);
    $router->get('/amenities/{id}', [AmenityController::class, 'show']);

    // Protected routes using the gateway middleware
    $router->middleware('gateway.auth')->group(function($router) {
        $router->post('/stays', [StayController::class, 'store']);
        $router->put('/stays/{id}', [StayController::class, 'update']);
        $router->delete('/stays/{id}', [StayController::class, 'destroy']);
        $router->get('/my-stays', [StayController::class, 'myStays']);
    });

    // Debug route
    $router->get('/debug/auth', function(Request $request) {
        return response()->json([
            'user_id' => $request->user_id,
            'headers' => $request->headers->all()
        ]);
    })->middleware('gateway.auth');
};
