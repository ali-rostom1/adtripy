<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class GatewayAuthentication
{
    /**
     * Handle an incoming request from the gateway service.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Log the incoming request
        Log::info('Gateway auth middleware processing request', [
            'headers' => $request->headers->all(),
            'user_id' => $request->input('user_id')
        ]);
        
        // Check if coming from gateway or has valid JWT
        if (!$request->hasHeader('X-Gateway-Service') && !$request->hasHeader('X-User-ID')) {
            // Fall back to JWT auth if request is direct and not from gateway
            if ($request->bearerToken()) {
                // Let the request through to be handled by SyncJwtUser
                return $next($request);
            }
            
            Log::warning('Request not from gateway and no bearer token');
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized access'
            ], 401);
        }
        
        // If it's from the gateway, extract user ID from header or request
        $userId = $request->header('X-User-ID', $request->input('user_id'));
        
        if (!$userId) {
            Log::warning('No user ID provided in gateway request');
            return response()->json([
                'status' => 'error',
                'message' => 'User ID is required' 
            ], 400);
        }
        
        // Add user_id to the request so controllers can access it
        $request->merge(['user_id' => $userId]);
        
        Log::info('Gateway authentication successful', ['user_id' => $userId]);
        
        return $next($request);
    }
}
