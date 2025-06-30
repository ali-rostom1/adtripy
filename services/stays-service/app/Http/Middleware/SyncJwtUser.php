<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class SyncJwtUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            Log::info('SyncJwtUser middleware processing request');
            
            if (!$request->bearerToken()) {
                Log::warning('No bearer token found in request');
                return response()->json(['error' => 'No authentication token provided'], 401);
            }
            
            // Parse token and get user ID
            $payload = JWTAuth::parseToken()->getPayload();
            $userId = $payload->get('sub');
            
            Log::info('JWT token parsed successfully', ['user_id' => $userId]);
            
            // DON'T try to find or create a user - just attach the ID to the request
            $request->merge(['user_id' => $userId]);
            
            Log::info('JWT token validated, user_id attached to request', ['user_id' => $userId]);
            
            return $next($request);
        } catch (\Exception $e) {
            Log::error('JWT authentication error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            return response()->json([
                'error' => $e->getMessage(), 
                'detail' => 'Authentication failed in SyncJwtUser middleware'
            ], 401);
        }
    }
}