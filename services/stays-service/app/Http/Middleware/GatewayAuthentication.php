<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        // Log EVERYTHING for debugging
        Log::info('Request headers', ['headers' => $request->headers->all()]);
        
        // Accept requests with either:
        // 1. X-Gateway-Service and X-User-ID headers (from gateway)
        // 2. Bearer token (direct API access)
        
        // Check for gateway headers first
        if ($request->hasHeader('X-Gateway-Service') && $request->hasHeader('X-User-ID')) {
            $userId = $request->header('X-User-ID');
            $request->merge(['user_id' => $userId]);
            
            Log::info('Gateway auth success', ['user_id' => $userId]);
            return $next($request);
        }
        
        // If no gateway headers, check for JWT token
        if ($request->bearerToken()) {
            try {
                // Validate JWT token
                $payload = \Tymon\JWTAuth\Facades\JWTAuth::parseToken()->getPayload();
                $userId = $payload->get('sub');
                
                // Attach user_id to request
                $request->merge(['user_id' => $userId]);
                
                Log::info('JWT auth success', ['user_id' => $userId]);
                return $next($request);
            } catch (\Exception $e) {
                Log::error('JWT validation failed: ' . $e->getMessage());
            }
        }
        
        // If we get here, authentication failed
        Log::warning('Authentication failed - no valid method found');
        return response()->json([
            'status' => 'error',
            'message' => 'User authentication failed'
        ], 401);
    }
}
